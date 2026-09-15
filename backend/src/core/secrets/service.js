import { validateObject } from "../../errors/validate-object";
import { SecretDTOSchema } from "../../modules/secrets/secrets.schema";
import { encryptionService } from "../../services/encryption";
import { SecretRepo } from "./repo";
import { buildPaginationMeta, } from "../../modules/shared/pagination.schema";
export const SecretService = {
    create: async (data, userId) => {
        const encryptValue = await encryptionService.encrypt(data.Value);
        const secret = await SecretRepo.create({ ...data, Value: encryptValue }, userId);
        return validateObject(SecretDTOSchema, secret);
    },
    // getAll: async (userId: string) => {
    //   const secrets = await SecretRepo.getAll(userId);
    //   const decryptedSecrets = secrets.map((secret) => ({
    //     ...secret,
    //     Value: encryptionService.decrypt(secret.Value),
    //   }));
    //   return decryptedSecrets.map((secret) =>
    //     validateObject<Secret.DTO>(SecretDTOSchema, secret),
    //   );
    // },
    getAll: async (userId, pagination) => {
        const { secrets, total } = await SecretRepo.getAll(userId, pagination);
        const decryptedSecrets = secrets.map((secret) => ({
            ...secret,
            Value: encryptionService.decrypt(secret.Value),
        }));
        return {
            data: decryptedSecrets.map((secret) => validateObject(SecretDTOSchema, secret)),
            meta: buildPaginationMeta(total, pagination),
        };
    },
    update: async (id, data, userId) => {
        if (data.Value != null) {
            data.Value = encryptionService.encrypt(data.Value);
        }
        const update = await SecretRepo.update(id, data, userId);
        update.Value = await encryptionService.decrypt(update.Value);
        return validateObject(SecretDTOSchema, update);
    },
    delete: async (id, userId) => {
        await SecretRepo.delete(id, userId);
        return { success: true };
    },
    getById: async (id, userId) => {
        const secret = await SecretRepo.getById(id, userId);
        secret.Value = await encryptionService.decrypt(secret.Value);
        return validateObject(SecretDTOSchema, { ...secret });
    },
};
