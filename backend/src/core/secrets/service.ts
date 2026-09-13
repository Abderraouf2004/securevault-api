import { validateObject } from "../../errors/validate-object";
import { SecretDTOSchema } from "../../modules/secrets/secrets.schema";
import { Secret } from "../../modules/secrets/secrets.types";
import { encryptionService } from "../../services/encryption";
import { SecretRepo } from "./repo";

export const SecretService = {
  create: async (data: Secret.Create, userId: string) => {
    const encryptValue = await encryptionService.encrypt(data.Value);
    const secret = await SecretRepo.create(
      { ...data, Value: encryptValue },
      userId,
    );
    return validateObject<Secret.DTO>(SecretDTOSchema, secret);
  },
  getAll: async (userId: string) => {
    const secrets = await SecretRepo.getAll(userId);
    const decryptedSecrets = secrets.map((secret) => ({
      ...secret,
      Value: encryptionService.decrypt(secret.Value),
    }));

    return decryptedSecrets.map((secret) =>
      validateObject<Secret.DTO>(SecretDTOSchema, secret),
    );
  },
  update: async (id: string, data: Secret.Update, userId: string) => {
    if (data.Value != null) {
      data.Value = encryptionService.encrypt(data.Value);
    }
    const update = await SecretRepo.update(id, data, userId);
    update.Value = await encryptionService.decrypt(update.Value);
    return validateObject<Secret.DTO>(SecretDTOSchema, update);
  },
  delete: async (id: string, userId: string) => {
    await SecretRepo.delete(id, userId);
    return { success: true };
  },
  getById: async (id: string, userId: string) => {
    const secret = await SecretRepo.getById(id, userId);
    secret.Value = await encryptionService.decrypt(secret.Value);
    return validateObject<Secret.DTO>(SecretDTOSchema, { ...secret });
  },
};
