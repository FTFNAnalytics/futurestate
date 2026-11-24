// Exact historical input retained when the live inventory grows. Never repin an old assessment.
export const retainedTranslationInput={
  source_path:'app/src/data/ai-reviewed-translations.json',
  storage_path:'app/public/data/review-inputs/translations-2026-09-27.json',
  whole_file_sha256:'fc249ac7f3395c346dad76c2964cbfd8b8509afe731eb1cc75d1976d709b572b',
  payload_sha256:'7bd71d8307d27b50dcca8d2e29e43aa101de7edeadb5d2e36a3394acae6819c1',
  route:'/data/review-inputs/translations-2026-09-27.json',
  retained_as_of:'2026-09-27',
  title:'Retained ten-translation inventory · September 27, 2026',
};
/** @param {{path:string,whole_file_sha256:string}} binding */
export function retainedAnnualAiInput(binding){
  if(binding.path!==retainedTranslationInput.source_path)return null;
  if(binding.whole_file_sha256!==retainedTranslationInput.whole_file_sha256)throw Error('Unknown retained annual input version');
  return retainedTranslationInput;
}
/** @param {{path:string,whole_file_sha256:string}} binding */
export const annualAiInputPath=binding=>retainedAnnualAiInput(binding)?.storage_path??binding.path;
