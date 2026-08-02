param(
  [string]$CollectionSlug = "darpa-usg-research-angles-2025-2026"
)

$ErrorActionPreference = "Stop"

$appRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$collectionPath = Join-Path $appRoot "src\content\research-collections\$CollectionSlug.json"
$documentsPath = Join-Path $appRoot "src\content\research-documents"
$downloadRoot = Join-Path $appRoot "public\downloads"

if (-not (Test-Path -LiteralPath $collectionPath -PathType Leaf)) {
  throw "Research collection not found: $CollectionSlug"
}

$collection = Get-Content -Raw -LiteralPath $collectionPath | ConvertFrom-Json
$archiveFileName = [System.IO.Path]::GetFileName([string]$collection.download_path)
$archivePath = Join-Path $downloadRoot $archiveFileName
$bundlePath = Join-Path $downloadRoot ([System.IO.Path]::GetFileNameWithoutExtension($archiveFileName))

if (
  -not $bundlePath.StartsWith($downloadRoot, [System.StringComparison]::OrdinalIgnoreCase) -or
  -not $archivePath.StartsWith($downloadRoot, [System.StringComparison]::OrdinalIgnoreCase)
) {
  throw "Resolved bundle or archive path is outside app/public/downloads."
}

$allDocuments = Get-ChildItem -LiteralPath $documentsPath -Filter "*.json" -File |
  Sort-Object Name |
  ForEach-Object { Get-Content -Raw -LiteralPath $_.FullName | ConvertFrom-Json }

$documentById = @{}
foreach ($document in $allDocuments) {
  $documentById[$document.id] = $document
}

$missingDocumentIds = @($collection.document_ids | Where-Object { -not $documentById.ContainsKey($_) })
if ($missingDocumentIds.Count -gt 0) {
  throw "Collection references missing document IDs: $($missingDocumentIds -join ', ')"
}

$documents = @($collection.document_ids | ForEach-Object { $documentById[$_] })
$foreignDocuments = @($documents | Where-Object { $_.collection_id -ne $collection.id })
if ($foreignDocuments.Count -gt 0) {
  throw "Collection includes documents assigned to another collection: $(($foreignDocuments | ForEach-Object { $_.id }) -join ', ')"
}

$expectedDocumentCount = @($collection.document_ids).Count
if ($documents.Count -ne $expectedDocumentCount) {
  throw "Expected $expectedDocumentCount collection documents; found $($documents.Count)."
}

if (-not (Test-Path -LiteralPath $bundlePath -PathType Container)) {
  New-Item -ItemType Directory -Path $bundlePath | Out-Null
}

$captureRows = foreach ($document in $documents) {
  $memberPath = [string]$document.archive_member
  $normalizedMemberPath = $memberPath.Replace("/", [System.IO.Path]::DirectorySeparatorChar)
  $capturePath = Join-Path $bundlePath $normalizedMemberPath

  if ($document.capture_status -eq "Official link record") {
    $captureDirectory = Split-Path -Parent $capturePath
    if (-not (Test-Path -LiteralPath $captureDirectory -PathType Container)) {
      New-Item -ItemType Directory -Path $captureDirectory | Out-Null
    }

    $publicationDate = if ($document.publication_date) { $document.publication_date } else { "Not stated" }
    $boundary = @($document.evidence_limits) -join " "
    $supportingUrls = @($document.supporting_official_urls)
    $supportingLines = if ($supportingUrls.Count -gt 0) {
      @("", "Supporting public artifacts:") + @($supportingUrls | ForEach-Object { "- $_" })
    } else {
      @()
    }
    @(
      "Title: $($document.title)",
      "Publisher: $($document.publisher)",
      "Publication date: $publicationDate",
      "Official URL: $($document.official_url)",
      "Capture status: $($document.capture_status)",
      "Record status: $($document.record_status)",
      "Captured by FTFN: $($document.captured_date)",
      "",
      "Boundary: $boundary"
      $supportingLines
    ) | Set-Content -LiteralPath $capturePath -Encoding utf8
  }

  if (-not (Test-Path -LiteralPath $capturePath -PathType Leaf)) {
    throw "Missing archive member for $($document.id): $memberPath"
  }

  $capture = Get-Item -LiteralPath $capturePath
  $hash = Get-FileHash -LiteralPath $capturePath -Algorithm SHA256

  [ordered]@{
    id = $document.id
    title = $document.title
    publisher = $document.publisher
    publication_date = if ($document.publication_date) { $document.publication_date } else { $null }
    document_type = $document.document_type
    capture_status = $document.capture_status
    archive_member = $memberPath
    bytes = $capture.Length
    sha256 = $hash.Hash.ToLowerInvariant()
    official_url = $document.official_url
    source_id = $document.source_id
    supporting_source_ids = @($document.supporting_source_ids)
    supporting_official_urls = @($document.supporting_official_urls)
  }
}

$manifest = [ordered]@{
  collection_id = $collection.id
  title = $collection.title
  captured_date = $collection.captured_date
  generated_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
  document_count = $documents.Count
  local_capture_count = @($documents | Where-Object { $_.capture_status -ne "Official link record" }).Count
  official_link_record_count = @($documents | Where-Object { $_.capture_status -eq "Official link record" }).Count
  disclosure = $collection.download_note
  method_note = $collection.method_note
  documents = $captureRows
}

$manifest |
  ConvertTo-Json -Depth 8 |
  Set-Content -LiteralPath (Join-Path $bundlePath "manifest.json") -Encoding utf8

$summaryLines = [System.Collections.Generic.List[string]]::new()
$summaryLines.Add("# $($collection.title)")
$summaryLines.Add("")
$summaryLines.Add($collection.summary)
$summaryLines.Add("")
$summaryLines.Add("Captured: $($collection.captured_date)")
$summaryLines.Add("")
$summaryLines.Add("## Interpretation boundary")
$summaryLines.Add("")
$summaryLines.Add($collection.method_note)
$summaryLines.Add("")

for ($index = 0; $index -lt $documents.Count; $index += 1) {
  $document = $documents[$index]
  $summaryLines.Add("## $($index + 1). $($document.title)")
  $summaryLines.Add("")
  $summaryLines.Add("**Publisher:** $($document.publisher)")
  $summaryLines.Add("")
  $summaryLines.Add("**Document type:** $($document.document_type)")
  $summaryLines.Add("")
  $summaryLines.Add("**Capture status:** $($document.capture_status)")
  $summaryLines.Add("")
  $summaryLines.Add($document.summary)
  $summaryLines.Add("")
  $summaryLines.Add("### Key findings")
  $summaryLines.Add("")
  foreach ($finding in $document.key_findings) {
    $summaryLines.Add("- $finding")
  }
  $summaryLines.Add("")
  $summaryLines.Add("### Why it matters")
  $summaryLines.Add("")
  $summaryLines.Add($document.why_it_matters)
  $summaryLines.Add("")
  $summaryLines.Add("### Evidence limits")
  $summaryLines.Add("")
  foreach ($limit in $document.evidence_limits) {
    $summaryLines.Add("- $limit")
  }
  $summaryLines.Add("")
  $summaryLines.Add("**Official source:** $($document.official_url)")
  $summaryLines.Add("")
  $summaryLines.Add("**Archive member:** ``$($document.archive_member)``")
  $summaryLines.Add("")
}

if ($summaryLines.Count -gt 0 -and $summaryLines[$summaryLines.Count - 1] -eq "") {
  $summaryLines.RemoveAt($summaryLines.Count - 1)
}

$summaryLines |
  Set-Content -LiteralPath (Join-Path $bundlePath "collection-summaries.md") -Encoding utf8

$readmeLines = @(
  "# $($collection.title)",
  "",
  "This FTFN bundle contains the $($documents.Count) primary records listed in the collection, a consolidated summary for every document, and a machine-readable manifest with official URLs, capture status, file size, and SHA-256 checksum.",
  "",
  "## Contents",
  "",
  "- Collection capture files: $(@($documents | Where-Object { $_.capture_status -ne 'Official link record' }).Count) official local captures and $(@($documents | Where-Object { $_.capture_status -eq 'Official link record' }).Count) official-link records.",
  "- ``collection-summaries.md``: FTFN summaries, key findings, relevance, and evidence limits for all $($documents.Count) documents.",
  "- ``manifest.json``: file inventory, capture status, official links, sizes, and checksums.",
  "",
  "## Capture exceptions",
  "",
  "Official-link records identify sources that were reviewed but whose hosts suppressed automated export. The bundle preserves those official URLs rather than substituting non-authoritative copies.",
  "",
  "## Interpretation boundary",
  "",
  $collection.method_note,
  "",
  "Captured by FTFN on $($collection.captured_date)."
)

$readmeLines |
  Set-Content -LiteralPath (Join-Path $bundlePath "README.md") -Encoding utf8

if (Test-Path -LiteralPath $archivePath -PathType Leaf) {
  Remove-Item -LiteralPath $archivePath -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$archiveStream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::CreateNew)
$archive = [System.IO.Compression.ZipArchive]::new(
  $archiveStream,
  [System.IO.Compression.ZipArchiveMode]::Create,
  $false
)
try {
  foreach ($file in Get-ChildItem -LiteralPath $bundlePath -File -Recurse | Sort-Object FullName) {
    $entryName = $file.FullName.Substring($bundlePath.Length + 1).Replace("\", "/")
    $entry = $archive.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $fileStream = [System.IO.File]::OpenRead($file.FullName)
    try {
      $fileStream.CopyTo($entryStream)
    }
    finally {
      $fileStream.Dispose()
      $entryStream.Dispose()
    }
  }
}
finally {
  $archive.Dispose()
  $archiveStream.Dispose()
}

$zip = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
try {
  $fileEntries = @($zip.Entries | Where-Object { -not $_.FullName.EndsWith("/") })
  $expectedArchiveFiles = $documents.Count + 3
  if ($fileEntries.Count -ne $expectedArchiveFiles) {
    throw "Expected $expectedArchiveFiles files in the archive; found $($fileEntries.Count)."
  }
}
finally {
  $zip.Dispose()
}

$archive = Get-Item -LiteralPath $archivePath
Write-Output "Research archive ready: $($archive.FullName)"
Write-Output "Documents: $($documents.Count); archive files: $($documents.Count + 3); bytes: $($archive.Length)"
