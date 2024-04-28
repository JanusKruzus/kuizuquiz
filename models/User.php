<?php

include 'Db.php';

Class User {

    private $email;
    private $username;
    private $password;

    public function reg(){
        $this->email = self::testInput($_POST["email"]);
        $this->username = self::testInput($_POST["username"]);
        $this->password = self::testInput($_POST["password"]);

        $db = new Db;
        $db->connect("localhost","root","","kuizuquiz");
        $db->insert("users", array("email"=>$this->email, "username"=>$this->username, "password"=>$this->password));
    
        
    }

    public function log(){

        
    }

    private static function testInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

}

if(isset($_POST["submit"])){
    $user = new User;
    $user->reg(); 
    header("Location: home");
    exit;
}
