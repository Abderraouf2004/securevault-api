import { tryCatch } from "../../errors/try-catch";
import { UsersService } from "./service";
export const UsersController = {
    getMe: tryCatch(async (req, res) => {
        const data = await UsersService.getMe(req.user?.id);
        res.status(200).json({
            data,
            message: "Current user retrieved successfully",
        });
    }),
    // getAll: tryCatch(async (req: Request, res: Response) => {
    //   const data = await UsersService.getAll();
    //   res.status(200).json({ data });
    // }),
    getAll: tryCatch(async (req, res) => {
        const pagination = req.query;
        const { data, meta } = await UsersService.getAll(pagination);
        res.status(200).json({ data, meta });
    }),
    getUserById: tryCatch(async (req, res) => {
        const data = await UsersService.getUserById(req.params.id);
        res.status(200).json({ data });
    }),
    updateUserRole: tryCatch(async (req, res) => {
        const data = await UsersService.updateUserRole(req.params.id, req.body.role);
        res.status(200).json({ data });
    }),
    updateUserprofile: tryCatch(async (req, res) => {
        const data = await UsersService.updateUserprofile(req.user?.id, req.body, req.file);
        res.status(200).json({ data });
    }),
    updateUserpassword: tryCatch(async (req, res) => {
        const data = await UsersService.updateUserpassword(req.user?.id, req.body);
        res.status(200).json({ data });
    }),
    deleteUser: tryCatch(async (req, res) => {
        const data = await UsersService.deleteUser(req.params.id);
        res.status(200).json({ data });
    }),
};
