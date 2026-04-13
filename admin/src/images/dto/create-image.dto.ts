export class CreateImageDto {
  artist: string;
  title: string;
  text?: string;
  /**
   * 쉼표로 구분된 태그 문자열 또는 태그 배열을 모두 허용합니다.
   * 예: "food,red" 또는 ["food","red"]
   */
  tags?: string | string[];
  earliestDate?: string;
  camera?: string;
  /**
   * 쉼표로 구분된 재료/세부정보 문자열 또는 배열
   * 예: "54mm,F4.3,1/100s,ISO400,0.0ev"
   */
  materials?: string | string[];
  dimensons?: string;
  /**
   * 선택적인 식별자
   */
  id?: number;
}
