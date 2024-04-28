<?php
// Wrapper pro snadnější práci s databází s použitím PDO a automatickým
// zabezpečením parametrů (proměnných) v dotazech.
class Db {

	// Databázové spojení
  private static $connection;

	// Výchozí nastavení ovladače
  private static $settings = array(
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_EMULATE_PREPARES => false,
	);

	// Připojí se k databázi pomocí daných údajů
  public static function connect($server, $user, $password, $database) {
	  if (!isset(self::$connection)) 
      {
        $dsn = "mysql:host=$server;dbname=$database;charset=utf8";
		self::$connection = new PDO(
			$dsn,
			$user,
			$password,
			self::$settings
		);
	  }
}
	
	// Spustí dotaz a vrátí z něj první řádek
  public static function queryOne($query, $parametres = array()) {
		  $return = self::$connection->prepare($query);
		  $return->execute($parametres);
	  return $return->fetch();
	}

	// Spustí dotaz a vrátí všechny jeho řádky jako pole asociativních polí
  public static function queryAll($query, $parametres = array()) {
		$return = self::$connection->prepare($query);
		$return->execute($parametres);
		return $return->fetchAll();
	}
	
	// Spustí dotaz a vrátí z něj první sloupec prvního řádku
  public static function dotazSamotny($query, $parametres = []) {
		$result = self::queryOne($query, $parametres);
		return $result[0];
	}
	
	// Spustí dotaz a vrátí počet ovlivněných řádků
	public static function query($query, $parametres = array()) {
		$stmt = self::$connection->prepare($query);
		$stmt->execute($parametres);
		return $stmt->rowCount();
	}

	public static function insert($table, $parametres = array()) {
		return self::query("INSERT INTO $table (".
		implode(', ', array_keys($parametres)).
		") VALUES (".str_repeat('?,', sizeOf($parametres)-1)."?)",
			array_values($parametres));
	}
	
	// Změní řádek v tabulce tak, aby obsahoval data z asociativního pole
	public static function change($table, $values = array(), $condition, $parametres = array()) {
		return self::query("UPDATE $table SET ".
		implode(' = ?, ', array_keys($values)).
		" = ? " . $condition,
		array_merge(array_values($values), $parametres));
	}
	
	// Vrací ID posledně vloženého záznamu
	public static function idOfLastInsert()
	{
		return self::$connection->lastInsertId();
	}
}