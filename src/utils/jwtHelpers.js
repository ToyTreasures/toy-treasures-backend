const CustomError = require("./CustomError");

const generateAccessAndRefreshTokens = async function (
  userId,
  getUserById,
  saveUserWithoutValidation
) {
  try {
    const user = await getUserById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await saveUserWithoutValidation(user);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new CustomError(
      "Something went wronge while generating access and refresh token",
      500
    );
  }
};

module.exports = { generateAccessAndRefreshTokens };
