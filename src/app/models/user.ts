export class User{
   
    constructor( 
        public id:number,
        public nombre:string,
        public apellido:string,
        public email:string,
        public password:string,
        public role:string,
        public passwordrepetido:string,
        public direccion:string,
        public celular:string,
        public vigencia_users:string,
        public dni:string,
        public id_doctor:string
        ){
      
    }
}