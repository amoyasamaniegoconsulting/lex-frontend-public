from fastapi import HTTPException, status

class AppError:
    """Clase centralizada para manejar errores personalizados en FastAPI."""

    @staticmethod
    def NOT_FOUND(entity: str, entity_id: int):
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{entity} with ID {entity_id} not found."
        )

    @staticmethod
    def INVALID_ID(entity: str, entity_id: int):
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid ID format for {entity}: {entity_id}."
        )

    @staticmethod
    def DATABASE_ERROR():
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="A database error occurred. Please try again later."
        )

    @staticmethod
    def UNAUTHORIZED():
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access. Please check your credentials."
        )

    @staticmethod
    def FORBIDDEN():
        return HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action."
        )

    @staticmethod
    def BAD_REQUEST(message: str = "Invalid request parameters."):
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    @staticmethod
    def CONFLICT(entity: str, message: str = "Conflict detected."):
        return HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{entity} conflict: {message}"
        )

    @staticmethod
    def SERVER_ERROR():
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected server error occurred. Please try again later."
        )

    @staticmethod
    def SERVICE_UNAVAILABLE():
        return HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The service is currently unavailable. Please try again later."
        )

    @staticmethod
    def CUSTOM_ERROR(status_code: int, message: str):
        return HTTPException(
            status_code=status_code,
            detail=message
        )
