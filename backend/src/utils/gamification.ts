import User from "../models/User";

export const updateGamification = async (
  userId: string,
  type: "answer" | "upvote"
) => {
  const user = await User.findById(userId);
  if (!user) return;

  if (type === "answer") user.points += 10;
  if (type === "upvote") user.points += 5;

  if (user.points >= 600) user.rank = "Platinum";
  else if (user.points >= 300) user.rank = "Gold";
  else if (user.points >= 100) user.rank = "Silver";
  else user.rank = "Bronze";

  if (user.points >= 100 && !user.badges.includes("100 Points"))
    user.badges.push("100 Points");

  if (user.points >= 300 && !user.badges.includes("Top Contributor"))
    user.badges.push("Top Contributor");

  await user.save();
};