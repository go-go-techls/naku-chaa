// 既存ユーザーにアバターを追加するスクリプト
const { PrismaClient } = require('@prisma/client');

// アバター生成関数（lib/avatar.tsからコピー）
const colors = [
  '#F0F9FF', '#ECFDF5', '#FEF3C7', '#FDE2E8', '#EFF6FF',
  '#F0FDF4', '#FFFBEB', '#F3E8FF', '#E0F2FE', '#FDF2F8',
];

const borderColors = [
  '#0EA5E9', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6',
  '#22C55E', '#F97316', '#A855F7', '#06B6D4', '#EC4899',
];

function generateAvatar(userId) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const colorIndex = Math.abs(hash) % colors.length;
  const backgroundColor = colors[colorIndex];
  const borderColor = borderColors[colorIndex];
  
  const patterns = [
    `<circle cx="20" cy="20" r="12" fill="${borderColor}" opacity="0.6"/>`,
    `<rect x="8" y="8" width="24" height="24" fill="${borderColor}" opacity="0.6" rx="4"/>`,
    `<polygon points="20,8 8,32 32,32" fill="${borderColor}" opacity="0.6"/>`,
    `<polygon points="20,8 32,20 20,32 8,20" fill="${borderColor}" opacity="0.6"/>`,
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
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function updateAvatars() {
  const prisma = new PrismaClient();
  
  try {
    // アバターがないユーザーを取得
    const users = await prisma.user.findMany({
      where: {
        avatar: null
      },
      select: {
        id: true
      }
    });
    
    console.log(`Found ${users.length} users without avatars`);
    
    // 各ユーザーにアバターを生成・更新
    for (const user of users) {
      const avatar = generateAvatar(user.id);
      await prisma.user.update({
        where: { id: user.id },
        data: { avatar }
      });
      console.log(`Updated avatar for user: ${user.id}`);
    }
    
    console.log('Avatar update completed!');
  } catch (error) {
    console.error('Error updating avatars:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAvatars();