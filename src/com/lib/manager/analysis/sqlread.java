package com.lib.manager.analysis;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.ppl.BaseClass.BasePerminterface;
import org.ppl.BaseClass.Permission;
import org.ppl.db.UserCoreDB;
import org.ppl.etc.UrlClassList;
import org.ppl.io.DesEncrypter;


public class sqlread extends Permission implements BasePerminterface {
	private List<String> rmc;
	private int dbid = 0;

	public sqlread() {
		// TODO Auto-generated constructor stub
		String className = this.getClass().getCanonicalName();
		// stdClass = className;
		super.GetSubClassName(className);
		setRoot("name", _MLang("name"));
		InAction();
		setRoot("fun", this);
	}

	@Override
	public void Show() {
		// TODO Auto-generated method stub
		if (super.Init() == -1)
			return;

		rmc = porg.getRmc();
		if (rmc.size() != 2) {
			Msg(_CLang("error_role"));
			return;
		}
		ListTip("name", "mongodbrule","ListRule");
		ListTip("title,view_name", "classinfo","ListView");
		
		
		if (porg.getKey("dbid") != null
				&& porg.getKey("dbid").toString().matches("[0-9]+")) {
			dbid = Integer.valueOf(porg.getKey("dbid"));
		}
		setRoot("dbid", dbid);
		
		switch (rmc.get(1).toString()) {
		case "read":
			read(null);
			break;
		case "search":
			search(null);
			break;
		case "create":
			create(null);
			return;
		case "edit":
			edit(null);
			break;
		default:
			Msg(_CLang("error_role"));
			return;
		}

		
		super.View();
	}

	public void read(Object arg) {
		
		UrlClassList ucl = UrlClassList.getInstance();
		setRoot("action_url", ucl.read(SliceName(stdClass)));
		setRoot("create_url", ucl.create(SliceName(stdClass)));
		dbList();
		String sql = porg.getKey("sql_script");

		if (sql != null) {
			setRoot("sql_edit", "\r\n" + sql.replace("&apos;", "\'"));
			sql = Myreplace(sql);

			setRoot("create_sql", unescapeHtml(sql));
			SqlView(sql);

		}
			
	}
	
	private void SqlView(String o) {
		String sql = o;
		List<Map<String, Object>> res;

		sql = sql.replace("\r", " ");
		sql = sql.replace("\t", " ");
		sql = sql.replace("\n", " ");

		// echo(sql.toLowerCase().matches("(.*)limit(.*)"));

		if (sql.toLowerCase().matches("(.*)limit(.*)") == false) {
			sql += " LIMIT 20";
		}
		
		try {
			if (dbid == 0) {
				res = FetchAll(sql);
			} else {
				res = CustomDB(sql, dbid);
				
			}
			if (res != null && res.size()>0) {
				Set<String> key = res.get(0).keySet();
				
				setRoot("Key_Title", key);
				setRoot("List_Data", res);
			}
		} catch (SQLException e) {
			setRoot("ErrorMsg", e.getMessage().toString());
		}
	}

	private List<Map<String, Object>> CustomDB(String sql, int id) {
		List<Map<String, Object>> res = null;
		UserCoreDB ucdb = new UserCoreDB();
		
		
		String format = "select * from "+DB_HOR_PRE+"dbsource where id=%d limit 1";
		String dsql = String.format(format, id);
		
		Map<String, Object> dres ;
		
		dres = FetchOne(dsql);
		if(dres==null)return null;
		
		ucdb.setDriverClassName(dres.get("dcname").toString());
		ucdb.setDbUrl(dres.get("url").toString());
		ucdb.setDbUser(dres.get("username").toString());
		String pwd = dres.get("password").toString();
		
		try {
			DesEncrypter de = new DesEncrypter();
			pwd = de.decrypt(pwd);
		} catch (Exception e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		ucdb.setDbPwd(pwd);
		
		
		if (ucdb.Init() == false) {			
			setRoot("ErrorMsg", ucdb.getErrorMsg());
		} else {
			try {
				res = ucdb.FetchAll(sql);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				setRoot("ErrorMsg", e.getMessage().toString());
			}

			ucdb.DBEnd();
		}
		return res;
	}

	private void dbList() {
		String sql = "select id,title from "+DB_HOR_PRE+"dbsource order by id desc; ";
		List<Map<String, Object>> res;
		
		
		try {
			res = FetchAll(sql);
			if(res!=null){
				setRoot("dblist", res);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			setRoot("ErrorMsg", e.getMessage().toString());
		}
		
	}
	
	@Override
	public void create(Object arg) {
		// TODO Auto-generated method stub
		String name = porg.getKey("name");
		String usql = porg.getKey("sql");
		int save_id = 0;
		if (porg.getKey("save_id") != null
				&& porg.getKey("save_id").toString().matches("[0-9]+")) {
			save_id = Integer.valueOf(porg.getKey("save_id"));
		}
		
		if (name == null || usql == null)
			return;
		usql = usql.replace("\r", " ");
		usql = usql.replace("\t", " ");
		usql = usql.replace("\n", " ");
		usql = usql.replace("'", "&apos;");
		//echo(usql);
		
		String format = " insert INTO " + DB_HOR_PRE
				+ "usersql (name,sql, dtype)values('%s','%s', %d);";
		String sql = String.format(format, name, usql, save_id);

		try {
			insert(sql);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		UrlClassList ucl = UrlClassList.getInstance();
		TipMessage(ucl.read(SliceName(stdClass)), _CLang("ok_save"));
	}

	@Override
	public void edit(Object arg) {
		// TODO Auto-generated method stub
			
	}

	@Override
	public void remove(Object arg) {
		// TODO Auto-generated method stub

	}

	@Override
	public void search(Object arg) {
		// TODO Auto-generated method stub

	}

	private String Myreplace(String old) {
		if (old == null)
			return "";

		String news = old.replace("&nbsp;", "");
		news = news.replace("&quot;", "\"");
		news = news.replace("&apos;", "\'");
		news = news.replace(";", "");
		news = news.replace("'", "\'");

		return news;
	}

	private String unescapeHtml(String old) {
		if (old == null)
			return "";

		String news = old.replace("\"", "&quot;");
		news = news.replace("\'", "&apos;");
		news = news.replace("\r", " ");
		news = news.replace("\t", " ");
		news = news.replace("\n", " ");

		return news;

	}
	
	private void ListTip(String n, String m, String l) {
		String sql = "select id,"+n+" from "+DB_HOR_PRE+m+" order by id desc";
		
		List<Map<String, Object>> res;
		
		try {
			res = FetchAll(sql);
			if(res!=null){
				setRoot(l, res);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
