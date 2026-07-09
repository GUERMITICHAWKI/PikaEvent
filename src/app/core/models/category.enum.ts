export enum CategoryEnum {
  AMOUR_CHIC = 'AMOUR_CHIC',
  AROUSSA = 'AROUSSA',
  RAYHAN = 'RAYHAN',
  RITEJ = 'RITEJ',
  AUTRE = 'AUTRE'
}

export const CATEGORY_LABELS: Record<CategoryEnum, string> = {
  [CategoryEnum.AMOUR_CHIC]: 'Amour Chic',
  [CategoryEnum.AROUSSA]: 'Aroussa',
  [CategoryEnum.RAYHAN]: 'Rayhan',
  [CategoryEnum.RITEJ]: 'Ritej',
  [CategoryEnum.AUTRE]: 'Autre'
};