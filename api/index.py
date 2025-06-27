from fastapi import FastAPI
from api.routers import flowEdge, flowNode, process, data, balances, flow, typeNode



### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Rutas
# Registra las rutas
app.include_router(process.router, prefix="/api/v1/py", tags=["Process"])
app.include_router(flowNode.router, prefix="/api/v1/py", tags=["FlowNode"])
app.include_router(flowEdge.router, prefix="/api/v1/py", tags=["FlowEdge"])
app.include_router(typeNode.router, prefix="/api/v1/py", tags=["TypeNode"])
app.include_router(data.router, prefix="/api/v1/py", tags=["Data"])
app.include_router(balances.router, prefix="/api/v1/py", tags=["Balances"])
app.include_router(flow.router, prefix="/api/v1/py", tags=["Flow"])
       
       
# Functional Method
@app.get("/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}




