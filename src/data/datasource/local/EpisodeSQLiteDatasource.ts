// src/data/datasources/EpisodeSQLiteDatasource.ts

import { WebsqlDatabase } from 'react-native-sqlite-2';// Reutilizamos el DTO de episodio
import { Logger } from '../../../utils/Logger';
import { Episode } from '../../../domain/model/Episode';

const logger = new Logger('EpisodeSQLiteDatasource');

export class EpisodeSQLiteDatasource {
    private db: WebsqlDatabase;

    constructor(db: WebsqlDatabase) {
        this.db = db;
    }

    // Convertir EpisodeDTO a un formato adecuado para la base de datos (array de valores)
    private mapDtoToDbValues(dto: Episode): any[] {
        return [
            dto.id,
            dto.titulo, // Asegúrate que tu DTO tiene 'title' si la tabla tiene 'titulo'
            dto.temporada,
            dto.episodio,
            dto.lanzamiento,
            JSON.stringify(dto.directores), // Guardar arrays como JSON strings
            JSON.stringify(dto.escritores),
            dto.descripcion,
            dto.valoracion ? 1 : 0, // SQLite no tiene booleano, usa 0 o 1
            JSON.stringify(dto.invitados),
        ];
    }

    // Convertir fila de la base de datos a EpisodeDTO
    private mapDbRowToDto(row: any): Episode {
        return {
            id: row.id,
            titulo: row.titulo,
            temporada: row.temporada,
            episodio: row.episodio,
            lanzamiento: row.lanzamiento,
            directores: JSON.parse(row.directores || '[]'),
            escritores: JSON.parse(row.escritores || '[]'),
            descripcion: row.descripcion,
            valoracion: row.valoracion === 1,
            invitados: JSON.parse(row.invitados || '[]'),
        };
    }

    async addViewedEpisode(episode: Episode): Promise<void> {
        logger.info(`💾 SQLite: Añadiendo episodio visualizado: ${episode.id}`);
        const values = this.mapDtoToDbValues(episode);
        // Usar INSERT OR REPLACE para actualizar si ya existe (útil si el usuario vuelve a "ver" un episodio)
        const sql = `INSERT OR REPLACE INTO viewed_episodes (
            id, titulo, temporada, episodio, lanzamiento, directores,
            escritores, descripcion, valoracion, invitados
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql(sql, values,
                    () => {
                        logger.info(`✅ SQLite: Episodio ${episode.id} añadido/actualizado.`);
                        resolve();
                    },
                    (_, error) => {
                        logger.error(`❌ SQLite: Error al añadir episodio ${episode.id}: ${error.message}`);
                        reject(error);
                        return true;
                    }
                );
            });
        });
    }

    async removeViewedEpisode(episodeId: string): Promise<void> {
        logger.info(`💾 SQLite: Eliminando episodio visualizado: ${episodeId}`);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql('DELETE FROM viewed_episodes WHERE id = ?;', [episodeId],
                    () => {
                        logger.info(`✅ SQLite: Episodio ${episodeId} eliminado.`);
                        resolve();
                    },
                    (_, error) => {
                        logger.error(`❌ SQLite: Error al eliminar episodio ${episodeId}: ${error.message}`);
                        reject(error);
                        return true;
                    }
                );
            });
        });
    }

    async getAllViewedEpisodes(): Promise<Episode[]> {
        logger.info('💾 SQLite: Obteniendo todos los episodios visualizados.');
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql('SELECT * FROM viewed_episodes;', [],
                    (_, { rows }) => {
                        const episodes: Episode[] = [];
                        for (let i = 0; i < rows.length; i++) {
                            episodes.push(this.mapDbRowToDto(rows.item(i)));
                        }
                        logger.info(`✅ SQLite: Encontrados ${episodes.length} episodios visualizados.`);
                        resolve(episodes);
                    },
                    (_, error) => {
                        logger.error(`❌ SQLite: Error al obtener episodios visualizados: ${error.message}`);
                        reject(error);
                        return true;
                    }
                );
            });
        });
    }

    async isEpisodeViewed(episodeId: string): Promise<boolean> {
        logger.info(`💾 SQLite: Comprobando si el episodio ${episodeId} ha sido visualizado.`);
        return new Promise((resolve, reject) => {
            this.db.transaction(tx => {
                tx.executeSql('SELECT id FROM viewed_episodes WHERE id = ?;', [episodeId],
                    (_, { rows }) => {
                        const isViewed = rows.length > 0;
                        logger.info(`✅ SQLite: Episodio ${episodeId} ¿visualizado? ${isViewed}`);
                        resolve(isViewed);
                    },
                    (_, error) => {
                        logger.error(`❌ SQLite: Error al comprobar episodio ${episodeId}: ${error.message}`);
                        reject(error);
                        return true;
                    }
                );
            });
        });
    }
}
