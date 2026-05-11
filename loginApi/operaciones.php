<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

 include("conexion.php");

 // Conexión a la base de datos
try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión a la base de datos: " . $e->getMessage());
}

// Función para verificar el inicio de sesión
function login($correo, $contrasena) {
    global $db;
    try{
        $stmt = $db->prepare("SELECT * FROM usuarios WHERE correo = :correo AND contrasena = :contrasena");
        $stmt->bindParam(':correo', $correo);
        $stmt->bindParam(':contrasena', $contrasena);
        $stmt->execute();

        if ($stmt->rowCount() > 0 ) {
            //usuario encontrado
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            //echo json_encode($row);
            return $row;
        }

        return false;
    }catch( PDOExeption $e ){
        // Manejar errores de la base de datos
        die("Error al verificar el inicio de sesión: " . $e->getMessage());
    }
}

function createUser($nombre, $correo, $contrasena){
    global $db;
    $stmt = $db->prepare("INSERT INTO usuarios (nombre, correo, contrasena) VALUES (:nombre, :correo, :contrasena)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':correo', $correo);
    $stmt->bindParam(':contrasena', $contrasena);
    $stmt->execute();
    echo json_encode(array("message" => "Usuario creado con exito"));
}