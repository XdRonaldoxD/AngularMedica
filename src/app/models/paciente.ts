export class Paciente{
    constructor(
        public id_paciente:number,
        public id_user:number,
        public NumeroCitaMedica:string,
        public Imagen:string,
        public NombrePaciente:string,
        public ApellidoPaciente:string,
        public SexoPaciente:string,
        public Dni:string,
        public FechaNaciemto:string,
        public Edad:string,
        public Direccion:string,
        public Celular:string,
        public Whatsapp:string,
        public Correo:string,
        public NombreFacebook:string,
        public Formacontactar:string,
        public MotivoConsulta:string,
        public GP:string,
        public FUR:string,
        public PAP:string,
        public MAC:string,
        public RAM:string,
        public AntecendesPersonales:string,
        public AntecendesFamiliares:string,
        public PA:string,
        public T:string,
        public FC:string,
        public FR:string,
        public Peso:string,
        public Talla:string,
        public ComentarioExamenClinico:string,
        public documentoLabotario:string,
        public diagnostico:[],
        public imageneologia:string,
        public proximacita:string,
        public tratamiento:string,


    ){

    }
}