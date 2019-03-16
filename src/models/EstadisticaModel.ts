export class EstadisticaModel {
    constructor(
        public id: number = 0,
        public touch_pass: number = 0,
        public annotation_by_race: number = 0,
        public annotation_by_pass: number = 0,
        public interceptions: number = 0,
        public sachs: number = 0,
        public conversions: number = 0,
    ) { }

}