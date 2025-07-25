// シンプルで主張しすぎないアバター生成

const colors = [
  '#F0F9FF', // sky-50
  '#ECFDF5', // emerald-50
  '#FEF3C7', // amber-50
  '#FDE2E8', // rose-50
  '#EFF6FF', // blue-50
  '#F0FDF4', // green-50
  '#FFFBEB', // orange-50
  '#F3E8FF', // purple-50
  '#E0F2FE', // cyan-50
  '#FDF2F8', // pink-50
];

const borderColors = [
  '#0EA5E9', // sky-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#F43F5E', // rose-500
  '#3B82F6', // blue-500
  '#22C55E', // green-500
  '#F97316', // orange-500
  '#A855F7', // purple-500
  '#06B6D4', // cyan-500
  '#EC4899', // pink-500
];

// ユーザーIDに基づいてランダムなアバターSVGを生成
export function generateAvatar(userId: string): string {
  // ユーザーIDからハッシュ値を生成（決定論的）
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  
  // ハッシュ値からインデックスを計算
  const colorIndex = Math.abs(hash) % colors.length;
  const backgroundColor = colors[colorIndex];
  const borderColor = borderColors[colorIndex];
  
  // シンプルな幾何学的図形を生成
  const patterns = [
    // 円
    `<circle cx="20" cy="20" r="12" fill="${borderColor}" opacity="0.6"/>`,
    // 正方形
    `<rect x="8" y="8" width="24" height="24" fill="${borderColor}" opacity="0.6" rx="4"/>`,
    // 三角形
    `<polygon points="20,8 8,32 32,32" fill="${borderColor}" opacity="0.6"/>`,
    // ダイアモンド
    `<polygon points="20,8 32,20 20,32 8,20" fill="${borderColor}" opacity="0.6"/>`,
    // 六角形
    `<polygon points="20,6 30,12 30,24 20,30 10,24 10,12" fill="${borderColor}" opacity="0.6"/>`,
  ];
  
  const patternIndex = Math.abs(hash >> 8) % patterns.length;
  const pattern = patterns[patternIndex];
  
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="${backgroundColor}" rx="20"/>
      ${pattern}
    </svg>
  `;
  
  // SVGをdata URLとして返す
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}