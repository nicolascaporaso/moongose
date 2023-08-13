import EErros from "../errors/enums.js"

const error = (err, req, res, next) => {
    const error = err;

    console.log(error.cause);

    switch (error.code) {
        case EErros.PRODUCT_ALREADY_EXISTS:
            res.status(409).json({ status: 'error', error: err.name, cause: err.cause });
            break;
        case EErros.INVALID_TYPES_ERROR:
            res.status(400).json({ status: 'error', error: err.name, cause: err.cause });
            break;
        case EErros.INVALID_REQUEST:
            break;

        default:
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
                payload: {},
            });
            break;
    }
};

export default error ;