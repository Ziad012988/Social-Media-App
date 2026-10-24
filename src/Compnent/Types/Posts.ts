export interface post {
  _id: string
  body: string
  image: string
  privacy: string
  user: User
  sharedPost: any
  likes: any[]
  createdAt: string
  commentsCount: number
  topComment: any
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
}

export interface User {
  _id: string
  name: string
  username: string
  photo: string
}

export interface UserSummary {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface commentType {
  _id: string;
  content: string;
  image: string ;          // null = لا يوجد صورة
  commentCreator: UserSummary;
  post: string;                  // id البوست
  parentComment: string | null;  // null = تعليق أساسي مش رد
  likes: string[];               // الأغلب ids (كانت فاضية في المثال)
  createdAt: string;             // تاريخ ISO
}