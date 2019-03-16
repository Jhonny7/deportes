export class EquipoModel {
    constructor(
        public id: number = 0,
        public descripcion: string = "",
        public id_jugador: number = 0,
        public id_usuario: number = 0,
        public id_estadistica: number = 0,
        public touch_pass: number = 0,
        public annotation_by_pass: number = 0,
        public annotation_by_race: number = 0,
        public interceptions: number = 0,
        public sachs: number = 0,
        public conversions: number = 0,
        public isActive: boolean = false,
        public fotografia: string = "",
        public fecha: string = ""
    ) { }

}