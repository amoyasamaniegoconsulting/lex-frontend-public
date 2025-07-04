from fastapi import FastAPI
from api.routers import flowEdge, flowNode, process, data, balances, flow, typeNode



### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

# Rutas
# Registra las rutas
app.include_router(process.router, prefix="/api", tags=["Process"])
app.include_router(flowNode.router, prefix="/api", tags=["FlowNode"])
app.include_router(flowEdge.router, prefix="/api", tags=["FlowEdge"])
app.include_router(typeNode.router, prefix="/api", tags=["TypeNode"])
app.include_router(data.router, prefix="/api", tags=["Data"])
app.include_router(balances.router, prefix="/api", tags=["Balances"])
app.include_router(flow.router, prefix="/api", tags=["Flow"])
        
       
# Functional Method
@app.get("/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}




