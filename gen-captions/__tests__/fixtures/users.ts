// テスト用ユーザーデータ
export const mockUsers = {
  regularUser: {
    userId: 'user-123',
    email: 'user@example.com',
    role: 'user',
    name: 'テストユーザー',
  },
  adminUser: {
    userId: 'admin-123',
    email: 'admin@example.com',
    role: 'admin',
    name: '管理者',
  },
  moderatorUser: {
    userId: 'mod-123',
    email: 'moderator@example.com',
    role: 'moderator',
    name: 'モデレーター',
  },
}

export const mockArts = {
  userArt: {
    id: 1,
    title: 'テスト作品',
    feature: 'テスト特徴',
    advantage: 'テスト優位性',
    advice: 'テストアドバイス',
    image: 'data:image/jpeg;base64,test',
    rating: 4,
    comment: 'テストコメント',
    character: 'テストキャラクター',
    is_public_allowed: false,
    userId: 'user-123',
    createdAt: new Date('2023-01-01'),
  },
}