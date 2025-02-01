import UiUpdate from "../../models/admin/uiUpdateModel";
import IUiUpdate from "../../entities/admin/IUiUpdate";
import logger from "../../utils/logger";
import ApiError from "../../utils/apiError";
import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Install with `npm install uuid`

interface IUiUpdateData {
  heroImage: string;
  heroText: string;
  subText1: string;
  subText2: string;
}

class UiUpdateRepository {
  // Ensure only one document exists and add a new UI update to the array
  async upsertUiUpdate(uiUpdateData: IUiUpdateData): Promise<IUiUpdate> {
    try {
      const id = uuidv4();

      const uiUpdateWithId = {
        id,
        ...uiUpdateData,
      };
      const updatedUiUpdate = await UiUpdate.findOneAndUpdate(
        {}, // Match the single document (no conditions to ensure only one exists)
        {
          $push: {
            uiUpdates: uiUpdateWithId, // Push the new update into the array
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).exec();

      return updatedUiUpdate;
    } catch (error: any) {
      logger.error(`Error upserting UI update: ${error.message}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while upserting UI update",
        [error.message]
      );
    }
  }

  // Retrieve the single UI update document with array of updates
  async getUiUpdate() {
    try {
      return await UiUpdate.findOne().exec(); // Retrieves the single document
    } catch (error: any) {
      logger.error("Error fetching the UI update document", error);
      throw new ApiError(
        500,
        "Internal Server Error while fetching the UI update document",
        [error.message]
      );
    }
  }

  // Clear the single UI update document by deleting all updates in the array
  async clearUiUpdate() {
    try {
      await UiUpdate.updateOne({}, { $set: { uiUpdates: [] } }).exec(); // Clears the array in the single document
      logger.info("UI update document cleared successfully");
    } catch (error: any) {
      logger.error("Error clearing the UI update document", error);
      throw new ApiError(
        500,
        "Internal Server Error while clearing the UI update document",
        [error.message]
      );
    }
  }

  // Update a specific UI update by its _id
  async updateUiUpdate(
    updateId: string,
    uiUpdateData: IUiUpdateData
  ): Promise<IUiUpdate | null> {
    try {
      const updatedUiUpdate = await UiUpdate.findOneAndUpdate(
        { "uiUpdates.id": updateId }, // Find the document and array element by _id
        {
          $set: {
            "uiUpdates.$.heroImage": uiUpdateData.heroImage,
            "uiUpdates.$.heroText": uiUpdateData.heroText,
            "uiUpdates.$.subText1": uiUpdateData.subText1,
            "uiUpdates.$.subText2": uiUpdateData.subText2,
          },
        }
      ).exec();

      if (!updatedUiUpdate) {
        throw new ApiError(404, "UI update not found");
      }

      return updatedUiUpdate;
    } catch (error: any) {
      logger.error(`Error updating UI update: ${error.message}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while updating the UI update",
        [error.message]
      );
    }
  }

  async deleteUiUpdate(updateId: string): Promise<IUiUpdate | null> {
    try {
      const result = await UiUpdate.findOneAndUpdate(
        { "uiUpdates.id": updateId }, // Match the document containing the update
        {
          $pull: {
            uiUpdates: { id: updateId }, // Remove the object by its _id
          },
        },
        { new: true } // Return the updated document
      ).exec();

      if (!result) {
        throw new ApiError(404, "UI update not found");
      }

      logger.info(`UI update with ID ${updateId} deleted successfully`);
      return result;
    } catch (error: any) {
      logger.error(`Error deleting UI update: ${error.message}`, error);
      throw new ApiError(
        500,
        "Internal Server Error while deleting the UI update",
        [error.message]
      );
    }
  }
}

export default new UiUpdateRepository();
