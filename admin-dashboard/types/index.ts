export interface Enseignement {
  id?: string;
  title: string;
  speaker: string;
  description?: string;
  category: string;
  duration?: number;
  audioUrl?: string;
  artworkUrl?: string;
  tags?: string[];
  playCount?: number;
  rating?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  mois?: string;
  annee?: string;
  typeCulte?: string;
  imagePublicId?: string;
  audioPublicId?: string;
}

export interface Annonce {
  id?: string;
  nom: string;
  description: string;
  dateCreation?: Date;
}

export interface LiveStream {
  id?: string;
  title: string;
  description?: string;
  pastor: string;
  thumbnailUrl?: string;
  streamUrl: string;
  streamKey?: string;
  status?: 'scheduled' | 'live' | 'ended';
  scheduledAt?: Date | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
  viewerCount?: number;
  peakViewerCount?: number;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  startDate: string | Date;
  endDate?: string | Date;
  location?: string;
  category?: string;
  color?: string;
  isAllDay?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  hasAlarm?: boolean;
  alarmDaysBefore?: number;
  alarmHoursBefore?: number;
  alarmMinutesBefore?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  favoriteTeachingIds?: string[];
  downloadedTeachingIds?: string[];
  recentlyPlayedIds?: string[];
  notificationsEnabled?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UserStats {
  totalUsers: number;
  usersWithFavorites: number;
  usersWithDownloads: number;
  totalFavorites: number;
  totalDownloads: number;
  notificationsEnabled: number;
  notificationsDisabled: number;
}

export interface TextResume {
  id?: string;
  title: string;
  speaker: string;
  description?: string;
  category: string;
  pdfUrl?: string;
  coverImageUrl?: string;
  tags?: string[];
  viewCount?: number;
  rating?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  mois?: string;
  annee?: string;
  typeCulte?: string;
  fileSize?: number;
  pageCount?: number;
  pdfPublicId?: string;
}

export interface ApiResponse<T> {
  id?: string;
  message?: string;
  data?: T;
  error?: string;
  details?: string;
}

