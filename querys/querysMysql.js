module.exports = {
	/* ----------------------------------------------------------------------- */
	/* ------------------------------ SELECTS -------------------------------- */
	/* ----------------------------------------------------------------------- */
	login:  "SELECT idUser, name, lastname, idRol, activate FROM user "+
			"WHERE email=? AND pass=?;",
	getRole: "SELECT nameRole FROM role WHERE idUser=?",
    listUsers:'SELECT u.idUser, u.name, u.lastname, u.pathSign, u.email, u.activate, '+
    		  "(SELECT COALESCE(r.nameRole,'') FROM role r WHERE r.idRole=u.idRol) as nameRole "+
			  'FROM user u;',
    getSignUser:'SELECT pathSign, passSign FROM user WHERE idUser=?;',
    dataUser:'SELECT name, lastname, email FROM user WHERE idUser=?',
    se_role: "SELECT a.code FROM actionsByRol ar "+
    		 "INNER JOIN action a ON (ar.idAction = a.idAction) "+
			 "WHERE ar.idRol=?",
	se_roleByName: "SELECT idRole FROM role "+
				   "WHERE nameRole=?",
	se_rolelist: "SELECT idRole, nameRole FROM role;",
	se_actions:  "SELECT idAction, name, descr, code FROM action;",
	se_rolRefAction: "SELECT idRol, idAction " +
					 "FROM actionsByRol " +
					 "WHERE idRol=? AND idAction=?",
	se_actionsByRol: "SELECT a.idAction, a.name, a.descr, a.code "+
					 "FROM actionsByRol ar "+
					 "INNER JOIN action a ON (ar.idAction=a.idAction) "+
					 "WHERE ar.idRol=?;",
	getInfoUser: "SELECT idUser, name, lastname, nit, email as user FROM user WHERE idUser=?;",
    /* ----------------------------------------------------------------------- */
	/* ------------------------------ UPDATES -------------------------------- */
	/* ----------------------------------------------------------------------- */
	up_dataUser: "UPDATE user "+
				 "SET name=?, "+
				 "lastname=? "+
				 "WHERE idUser=?;",
	up_dataUserAdmin: "UPDATE user "+
				 "SET name=?, "+
				 "lastname=? "+
				 "pathSign=? "+
				 "WHERE idUser=?;",
	up_passUser: "UPDATE user "+
				 "SET pass=? "+
				 "WHERE idUser=?;",
	up_emailUser:"UPDATE user "+
				 "SET email=? "+
				 "WHERE idUser=?;",
	up_role: "UPDATE role "+
			 "SET nameRole=? "+
			 "WHERE idRole=?;",
	up_roleUser: "UPDATE user "+
			 "SET idRol=? "+
			 "WHERE idUser=?",
	up_activateUser: "UPDATE user "+
				 "SET activate=? "+
				 "WHERE idUser=?;",
	/* ----------------------------------------------------------------------- */
	/* ------------------------------ INSERTS -------------------------------- */
	/* ----------------------------------------------------------------------- */
	in_role: "INSERT INTO role "+
			 "(nameRole) "+
			 "VALUES(?);",
	in_user: "INSERT INTO user "+
			 "(email, pass, name, lastname, pathSign, activate, idRol) "+
			 "VALUES(?, ?, ?, ?, ?, 1, ?);",
	in_rolRefAction: "INSERT INTO actionsByRol " +
					 "(idRol, idAction) " +
					 "VALUES(?, ?);",
	/* ----------------------------------------------------------------------- */
	/* ------------------------------ DELETE  -------------------------------- */
	/* ----------------------------------------------------------------------- */
	dl_role: "DELETE FROM role "+
			 "WHERE idRole=?;",
	dl_rolRefAction: "DELETE FROM actionsByRol " +
					 "WHERE idRol=? AND idAction=?;"
}

