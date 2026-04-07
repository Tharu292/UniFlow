// src/controllers/notificationController.ts
import { Request, Response } from "express";
import { Notification } from "../models/Notification";

// Get all notifications with filters
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      priority,
      status,
      targetAudience,
      targetFaculty,
      targetSemester,
      targetYear,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter: any = {};
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (targetFaculty && targetFaculty !== 'all') filter.targetFaculty = targetFaculty;
    if (targetSemester && targetSemester !== 'all') filter.targetSemester = targetSemester;
    if (targetYear && targetYear !== 'all') filter.targetYear = targetYear;
    
    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    const sort: any = {};
    sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const notifications = await Notification.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get student-specific notifications (filtered by faculty, semester, year)
export const getStudentNotifications = async (req: Request, res: Response) => {
  try {
    const { faculty, semester, year } = req.query;
    
    const filter: any = {
      status: "active",
      expiryDate: { $gte: new Date() }
    };
    
    // Build filter for student
    filter.$or = [
      { targetAudience: "All Students" },
      { targetAudience: "By Faculty", targetFaculty: faculty },
      { targetAudience: "By Semester", targetSemester: semester },
      { targetAudience: "By Year", targetYear: year },
    ];
    
    const notifications = await Notification.find(filter)
      .sort({ priority: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching student notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
    });
  }
};

// Get single notification by ID
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notification",
    });
  }
};

// Create new notification
export const createNotification = async (req: Request, res: Response) => {
  try {
    const {
      title,
      message,
      priority,
      targetAudience,
      targetFaculty,
      targetSemester,
      targetYear,
      expiryDate,
      createdBy = "Admin",
    } = req.body;

    // Validate input
    const errors: any = {};
    
    if (!title?.trim()) {
      errors.title = "Title is required";
    } else if (title.length < 5) {
      errors.title = "Title must be at least 5 characters";
    } else if (title.length > 100) {
      errors.title = "Title must be less than 100 characters";
    }

    if (!message?.trim()) {
      errors.message = "Message is required";
    } else if (message.length < 20) {
      errors.message = "Message must be at least 20 characters";
    } else if (message.length > 500) {
      errors.message = "Message must be less than 500 characters";
    }

    if (!expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else {
      const expiryDateObj = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(expiryDateObj.getTime())) {
        errors.expiryDate = "Invalid date format";
      } else if (expiryDateObj < today) {
        errors.expiryDate = "Expiry date must be today or in the future";
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // Create notification
    const notification = new Notification({
      title,
      message,
      priority,
      targetAudience,
      targetFaculty: targetAudience === "By Faculty" ? targetFaculty : "",
      targetSemester: targetAudience === "By Semester" ? targetSemester : "",
      targetYear: targetAudience === "By Year" ? targetYear : "",
      expiryDate: new Date(expiryDate),
      createdBy,
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: "Error creating notification",
    });
  }
};

// Update notification
export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.expiryDate) {
      updateData.expiryDate = new Date(updateData.expiryDate);
    }

    const notification = await Notification.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notification",
    });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
    });
  }
};

// Get notification statistics
export const getNotificationStats = async (req: Request, res: Response) => {
  try {
    const total = await Notification.countDocuments();
    const active = await Notification.countDocuments({ status: "active" });
    const expired = await Notification.countDocuments({ status: "expired" });
    const highPriority = await Notification.countDocuments({ priority: "High" });
    
    const viewsAggregation = await Notification.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = viewsAggregation[0]?.totalViews || 0;

    const audienceStats = await Notification.aggregate([
      { $group: { _id: "$targetAudience", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        active,
        expired,
        highPriority,
        totalViews,
        audienceDistribution: audienceStats,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
    });
  }
};

// Bulk delete expired notifications
export const deleteExpiredNotifications = async (req: Request, res: Response) => {
  try {
    const result = await Notification.deleteMany({ 
      expiryDate: { $lt: new Date() } 
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} expired notifications deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting expired notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting expired notifications",
    });
  }
};