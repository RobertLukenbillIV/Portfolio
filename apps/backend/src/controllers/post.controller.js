import * as svc from '../services/post.service';
export async function list(_req, res) { res.json(await svc.list()); }
export async function listPublic(_req, res) { res.json(await svc.listPublic()); }
export async function create(req, res) {
    const user = req.user;
    const created = await svc.create({ ...req.body, authorId: user.id });
    res.status(201).json(created);
}
export async function remove(req, res) { await svc.remove(req.params.id); res.status(204).end(); }
