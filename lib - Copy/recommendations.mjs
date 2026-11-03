/** @param {{slug:string,category:string}[]} materials @param {string[]} completedSlugs @param {string[]} weakCategories */
export function recommendNext(materials, completedSlugs, weakCategories = []) {
  const remaining = materials.filter(material => !completedSlugs.includes(material.slug));
  return remaining.find(material => weakCategories.includes(material.category)) ?? remaining[0] ?? null;
}
