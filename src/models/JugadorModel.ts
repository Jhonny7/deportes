export class JugadorModel {
    constructor(
        public id: number = 0,
        public nombre: string = "",
        public fotografia: string = "",
        public rama: string = "",
        public apellidoPaterno: string = "",
        public apellidoMaterno: string = "",
        public idLevel: number = 0,
        public level: string = "",
        public sale: number = 0
    ) { }

}