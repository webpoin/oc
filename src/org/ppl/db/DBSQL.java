package org.ppl.db;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.ppl.BaseClass.BaseLang;
import org.ppl.etc.globale_config;

public class DBSQL extends BaseLang {

	public static DBSQL dataSource = null;
	private Connection ConDB = null;
	private Statement stmt = null;
	protected String DB_NAME = mConfig.GetValue("db.name");
	protected String DB_PRE = mConfig.GetValue("db.rule.ext");
	protected String DB_HOR_PRE = mConfig.GetValue("db.hor.ext");
	protected String DB_WEB_PRE = mConfig.GetValue("db.web.ext");

	private String ErrorMsg = "";
	private ResultSet rs = null;
	private int Cursor = 0;
	private int MaxLimit = 1000; // max cursor

	public DBSQL() {

	}

	public void SetCon(Connection extDB) {
		ConDB = extDB;
	}

	public void end() {
		try {
			if(stmt!=null)
				stmt.close();
			// c.commit();
			// c.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void free() {
		HikariConnectionPool hcp = HikariConnectionPool.getInstance();
		hcp.free();
	}

	public void rollback() {
		if (ConDB == null) {
			long tid = myThreadId();
			ConDB = globale_config.GDB.get(tid);
		}
		try {
			if (ConDB != null) {
				ConDB.rollback();
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public List<Map<String, Object>> map() throws SQLException {
		List<Map<String, Object>> results = new ArrayList<Map<String, Object>>();
		Object value = null;
		try {
			if (rs != null) {
				ResultSetMetaData meta = rs.getMetaData();
				int numColumns = meta.getColumnCount();
				while (Cursor < MaxLimit && rs.next()) {
					Cursor++;
					Map<String, Object> row = new HashMap<String, Object>();
					for (int i = 1; i <= numColumns; ++i) {
						String name = meta.getColumnName(i);

						if (meta.getColumnTypeName(i).equals("TINYINT")) {
							value = rs.getInt(i);

						} else {
							value = rs.getObject(i);
						}

						row.put(name, value);
					}
					results.add(row);
				}
			}
		} finally {
		}

		return results;
	}

	private List<Map<String, Object>> query(String sql) throws SQLException {
		List<Map<String, Object>> results = null;

		if (Cursor < MaxLimit) {

			if (ConDB == null) {
				long tid = myThreadId();
				ConDB = globale_config.GDB.get(tid);

			}

			String clearSQL = sql;
			if (myConfig.GetValue("database.driverClassName").equals(
					"org.postgresql.Driver")) {
				clearSQL = sql.replace("`", "");
			}

			if (ConDB == null) {
				echo("con sql:" + clearSQL);
				return null;
			}

			stmt = ConDB.createStatement();
			rs = stmt.executeQuery(clearSQL);
		}

		Cursor = 0;
		results = map();

		if (Cursor < MaxLimit) {

			rs.close();
			stmt.close();
			Cursor = 0;
		}

		return results;
	}

	public boolean isFetchFinal() {

		if (Cursor == 0)
			return true;
		else {
			return false;
		}
	}

	public List<Map<String, Object>> FetchAll(String sql) throws SQLException {
		return query(sql);
	}

	public Map<String, Object> FetchOne(String sql) {
		Map<String, Object> results = null;
		List<Map<String, Object>> fetlist = null;

		try {
			fetlist = query(sql);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			setErrorMsg(e.getMessage().toString());
		}
		if (fetlist != null && fetlist.size() > 0) {
			results = fetlist.get(0);
		}

		return results;
	}

	public long update(String sql) throws SQLException {
		return exec(sql, false);
	}

	public long insert(String sql) throws SQLException {
		long numRowsUpdated = -1;
		exec(sql, false);

		return numRowsUpdated;
	}

	public long insert(String sql, boolean ret) throws SQLException {
		long numRowsUpdated = -1;
		exec(sql, ret);
		if (ret) {
			ResultSet rs = stmt.getGeneratedKeys();

			if (rs.next()) {
				numRowsUpdated = rs.getLong(1);
			}
		}
		return numRowsUpdated;
	}

	public void dbcreate(String sql) throws SQLException {
		exec(sql, false);
	}

	private long exec(String sql, boolean ret) throws SQLException {
		long numRowsUpdated = -1;
		if (ConDB == null) {
			long tid = myThreadId();
			ConDB = globale_config.GDB.get(tid);
		}

		String clearSQL = sql;
		if (myConfig.GetValue("database.driverClassName").equals(
				"org.postgresql.Driver")) {
			clearSQL = sql.replace("`", "");
		}

		if (ConDB == null) {
			echo("con sql:" + clearSQL);
			return -1;
		}

		stmt = ConDB.createStatement();
		stmt.clearBatch();
		if (ret) {
			numRowsUpdated = stmt.executeUpdate(clearSQL,
					Statement.RETURN_GENERATED_KEYS);
		} else {
			stmt.executeUpdate(clearSQL);
		}
		return numRowsUpdated;
	}

	public void CommitDB() {
		if (ConDB == null) {
			long tid = myThreadId();
			ConDB = globale_config.GDB.get(tid);
		}
		try {
			ConDB.commit();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public String getErrorMsg() {
		return ErrorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		ErrorMsg = errorMsg;
	}
}
