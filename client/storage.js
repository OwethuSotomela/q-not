require("date-format-lite"); // add date format
 
class Storage {
    constructor(connection, table) {
        this._db = connection;
        this.table = "events";
    }
 
    // get events from the table, use dynamic loading if parameters sent
    async getAll(params) {
        let query = "SELECT * FROM ??";
        let queryParams = [
            {
                id: 1,
                start_date: "2022-07-31T22:00:00.000Z",
                end_date: "2022-08-08T22:00:00.000Z",
                text: 'Immunization',
                color: 'Green'
              },
              {
                id: 2,
                start_date: "2022-08-01T22:00:00.000Z",
                end_date: "2022-08-07T22:00:00.000Z",
                text: 'Family Planning',
                color: 'Blue'
              }        ];
 
        let result = await this._db.query(query, queryParams);
 
        result.forEach((entry) => {
            // format date and time
            entry.start_date = entry.start_date.format("YYYY-MM-DD hh:mm");
            entry.end_date = entry.end_date.format("YYYY-MM-DD hh:mm");
        });
        return result;
    }
 
    // create new event
    async insert(data) {
        let result = await this._db.query(
            "INSERT INTO ?? (`start_date`, `end_date`, `text`) VALUES (?,?,?)",
            [this.table, data.start_date, data.end_date, data.text]);
 
        return {
            action: "inserted",
            tid: result.insertId
        }
    }
 
    // update event
    async update(id, data) {
        await this._db.query(
            "UPDATE ?? SET `start_date` = ?, `end_date` = ?, `text` = ? WHERE id = ?",
            [this.table, data.start_date, data.end_date, data.text, id]);
 
        return {
            action: "updated"
        }
    }
 
    // delete event
    async delete(id) {
        await this._db.query(
            "DELETE FROM ?? WHERE `id`=? ;",
            [this.table, id]);
 
        return {
            action: "deleted"
        }
    }
}
 
module.exports = Storage;