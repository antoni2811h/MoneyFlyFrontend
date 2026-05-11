<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

require("operaciones.php");
$ruta = $_GET['url'] ?? '';
//echo $ruta;
if ($ruta === 'login') {
    // Verificar si se recibieron datos del usuario
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener los datos del inicio de sesión desde el cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);
        //echo json_encode($data);
        $correo = $data['correo'];
        $contrasena = $data['contrasena'];

        // Verificar el inicio de sesión
        $userData = login($correo, $contrasena);
        //echo json_encode($userData);
        if ($userData) {
            // Usuario autenticado, devolver los datos del usuario en formato JSON
            http_response_code(200);
            echo json_encode($userData);
        } else {
            // Credenciales incorrectas
            http_response_code(401);
            echo json_encode(array("message" => "Credenciales incorrectas"));
        }
    } else {
        // Método no permitido
        http_response_code(405);
        echo json_encode(array("message" => "Metodo no permitido"));
    }
}else if ($ruta === 'register') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener los datos del inicio de sesión desde el cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);
        //echo json_encode($data);
        $nombre = $data['nombre'];
        $correo = $data['correo'];
        $contrasena = $data['contrasena'];
        //pasar los datos a la funcion
        createUser($nombre, $correo, $contrasena);

    } else {
        // Método no permitido
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
    }
 
}else{
    http_response_code(404);
    echo json_encode(array("message" => "Ruta no encontrada"));
}

//INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `imagen`, `created_at`, `updated_at`) VALUES (1, 'Hamburgueza', 'Hamburguesa doble carne', '30000', '10', 'https://www.irenemilito.it/wp-content/uploads/2017/03/23-double-bacon-cheeseburger.w710.h473.jpg', current_timestamp(), current_timestamp());