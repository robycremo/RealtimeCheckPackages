import sql from "mssql";
import { Server } from "socket.io";
import logger from "./config/logger";

export class NotificationService {
  private io: Server;
  private pollingInterval: NodeJS.Timeout | null = null;

  constructor(io: Server) {
    this.io = io;
  }

  public startPolling() {
    if (this.pollingInterval) return;

    this.pollingInterval = setInterval(async () => {
      try {
        const pool = await sql.connect();
        const result = await pool.request().query(`
          SELECT TOP 50 * 
          FROM ChangeNotifications 
          WHERE Processed = 0 
          ORDER BY CreatedAt ASC
        `);

        for (const row of result.recordset) {
          this.io.emit("dbChange", {
            table: row.TableName,
            action: row.Action,
            recordId: row.RecordId,
            createdAt: row.CreatedAt
          });

          // Mark notification as processed
          await pool.request()
            .input("NotificationId", sql.Int, row.NotificationId)
            .query(`UPDATE ChangeNotifications SET Processed = 1 WHERE NotificationId = @NotificationId`);
        }
      } catch (error) {
        logger.error("Error polling ChangeNotifications", error);
      }
    }, 2000); // ogni 2 secondi
  }

  public stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}
