export class Perfil{
    constructor(
      public id_usuario:number,
      public  nombre_usuario:string,
      public  apellido_usuario:string,
      public  correo_usuario:string,
      public  imagen_usuario:File,
    ){

    }
}