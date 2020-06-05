import knex from "../database/connection";
import { Request, Response } from 'express'

class PointsController {
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        const trx = await knex.transaction();

        const point = {
            image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('point').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items.map((items_id: number) => {
            return {
                items_id,
                point_id
            };
        });

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: point_id,
            ...point,
            items: pointItems
        });
    }

    async show(request: Request, response: Response) {
        const id  = Number(request.params.id);

        const point = await knex('point').where('id', id).first();

        if(!point) {
            return response.status(400).json({message: 'Point not found'})
        } 

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.items_id')
            .where('point_items.point_id', id);

        return response.json({
            point,
            items
        })
    }

    async index (request: Request, response: Response) {
        const {city, uf, items} = request.query

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));


        const points = await knex('point')
        .join('point_items', 'point.id', '=', 'point_items.point_id')
        .whereIn('point_items.items_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('point.*');

        return response.json(points)
    }
}

export default PointsController;