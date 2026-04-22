export type MovementType = 'ganada' | 'reclamada';
export type NotificationStatus = 'si' | 'no' | 'pendiente';

export interface TimeMovement {
  id: string;
  user_id: string;
  movement_date: string;
  movement_type: MovementType;
  hours: number;
  reason: string;
  notification_status: NotificationStatus;
  notes: string | null;
  quick_tag: string | null;
  source_context: Record<string, unknown> | null;
  favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface SummaryStats {
  balance: number;
  totalWon: number;
  totalClaimed: number;
  claimedDays: string[];
}
