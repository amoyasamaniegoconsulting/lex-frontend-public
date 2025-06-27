import io
import uuid
from typing import List, Dict, Tuple
import pandas as pd
from api.spark_session import spark
import xml.etree.ElementTree as ET
from api.models.data import DataFT
from pyspark.sql.types import *

from api.utils.dian import calcular_dv

from reportlab.lib.pagesizes import A3, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER

class DataService:
    @staticmethod
    def equivalent_type(f):
        if f == 'datetime64[ns]': return TimestampType()
        elif f == 'int64': return LongType()
        elif f == 'int32': return IntegerType()
        elif f == 'float64': return DoubleType()
        elif f == 'float32': return FloatType()
        else: return StringType()

    @staticmethod
    def define_structure(string, format_type):
        try: typo = DataService.equivalent_type(format_type)
        except: typo = StringType()
        return StructField(string, typo)

    # Given pandas dataframe, it will return a spark's dataframe.
    @staticmethod
    def pandas_to_spark(pandas_df):
        columns = list(pandas_df.columns)
        types = list(pandas_df.dtypes)
        struct_list = []
        for column, typo in zip(columns, types): 
            struct_list.append(DataService.define_structure(column, typo))
        p_schema = StructType(struct_list)
        return spark.createDataFrame(pandas_df, p_schema)

    @staticmethod
    def export_to_xml(data: List[Dict]) -> Tuple[io.BytesIO, str]:
        root = ET.Element("root")

        for item in data:
            record = ET.SubElement(root, "record")
            for key, value in item.items():
                child = ET.SubElement(record, key)
                child.text = str(value)

        tree = ET.ElementTree(root)
        buffer = io.BytesIO()
        tree.write(buffer, encoding="utf-8", xml_declaration=True)
        buffer.seek(0)
        return buffer, "data.xml"

    @staticmethod
    def export_to_xlsx(data: List[Dict]):
        # Convertimos la lista de diccionarios a DataFrame de Pandas
        pdf = pd.DataFrame(data)

        # Lo pasamos a Spark DataFrame si necesitas (opcional)
        sdf = DataService.pandas_to_spark(pdf)

        # Volvemos a convertir a Pandas si necesitas procesarlo (en tu caso puedes usar directamente `pdf`)
        pdf = sdf.toPandas()

        # Diccionario de mapeo para cambiar el nombre de las columnas
        column_mapping = {
            "lineaNegocio": "Linea de negocio",
            "tipoDeudor": "Tipo de deudor",
            "idDeudor": "Id Deudor",
            "dvDeudor": "Dv Deudor",
            "nombreDeudor": "Nombre deudor",
            "codigoMunicipio": "Codigo Municipio",
            "conceptoDeudores": "Concepto Deudores",
            "tipoDeuda": "Tipo Deuda",
            "medicionPosterior": "Medicion Posterior",
            "cxcPendientesRadicar": "Cxc pntes Radicar",
            "cxcNoVencidas": "Cxc no Vencidas",
            "cxcMora30Dias": "Cxc Mora 30 dias",
            "cxcMora60Dias": "Cxc Mora 60 dias",
            "cxcMora90Dias": "Cxc Mora 90 dias",
            "cxcMora180Dias": "Cxc Mora 180 dias",
            "cxcMora360Dias": "Cxc Mora 360 dias",
            "cxcMoraMayor360Dias": "Cxc Mora >360 dias",
            "deterioro30Dias": "Deterioro 30 dias",
            "deterioro60Dias": "Deterioro 60 dias",
            "deterioro90Dias": "Deterioro 90 dias",
            "deterioro180Dias": "Deterioro 180 dias",
            "deterioro360Dias": "Deterioro 360 dias",
            "deterioroMayor360Dias": "Deterioro >360 dias",
            "ajuste": "Ajuste",
            "saldo": "Saldo"
        }

        # Cambiar los nombres de las columnas usando el mapeo
        pdf = pdf.rename(columns=column_mapping)

        memory_file = io.BytesIO()
        with pd.ExcelWriter(memory_file, engine="xlsxwriter") as writer:
            pdf.to_excel(writer, index=False, sheet_name="Sheet1")
            workbook = writer.book
            worksheet = writer.sheets["Sheet1"]

            # Formato para el encabezado de las columnas
            header_format = workbook.add_format({
                "align": "left",            # Justificación a la izquierda
                "bold": True,               # Negritas
                "font_color": "#FFFFFF",    # Color de texto blanco
                "bg_color": "#4F81BD",      # Color de fondo azul
                "font_name": "Calibri",     # Fuente Calibri
                "font_size": 10             # Tamaño de letra 10
            })

            # Formato para el resto de las celdas
            cell_format = workbook.add_format({
                "align": "left",            # Justificación a la izquierda
                "font_name": "Calibri",     # Fuente Calibri
                "font_size": 10             # Tamaño de letra 10
            })

            # Aplicar el formato a los encabezados
            for col_num, col_name in enumerate(pdf.columns):
                worksheet.write(0, col_num, col_name, header_format)

            # Ajuste automático de columnas y aplicación del formato de celda
            for idx, col in enumerate(pdf.columns):
                max_length = max(pdf[col].astype(str).map(len).max(), len(col)) + 2
                worksheet.set_column(idx, idx, max_length, cell_format)

        memory_file.seek(0)
        return memory_file, f"data_{uuid.uuid4().hex}.xlsx"
    
    
    @staticmethod
    def export_to_pdf(data: List[Dict]):
        df = pd.DataFrame(data)

        column_mapping = {
            "lineaNegocio": "Linea de negocio",
            "tipoDeudor": "Tipo deudor",
            "idDeudor": "Id Deudor",
            "dvDeudor": "Dv Deudor",
            "nombreDeudor": "Nombre deudor",
            "codigoMunicipio": "Codigo Municipio",
            "conceptoDeudores": "Concepto Deudores",
            "tipoDeuda": "Tipo Deuda",
            "medicionPosterior": "Medicion Posterior",
            "cxcPendientesRadicar": "Cxc pntes Radicar",
            "cxcNoVencidas": "Cxc no Vencidas",
            "cxcMora30Dias": "Cxc Mora 30 dias",
            "cxcMora60Dias": "Cxc Mora 60 dias",
            "cxcMora90Dias": "Cxc Mora 90 dias",
            "cxcMora180Dias": "Cxc Mora 180 dias",
            "cxcMora360Dias": "Cxc Mora 360 dias",
            "cxcMoraMayor360Dias": "Cxc Mora >360 dias",
            "deterioro30Dias": "Deterioro 30 dias",
            "deterioro60Dias": "Deterioro 60 dias",
            "deterioro90Dias": "Deterioro 90 dias",
            "deterioro180Dias": "Deterioro 180 dias",
            "deterioro360Dias": "Deterioro 360 dias",
            "deterioroMayor360Dias": "Deterioro >360 dias",
            "ajuste": "Ajuste",
            "saldo": "Saldo"
        }

        df = df.rename(columns=column_mapping)
        df = df.fillna("")

        buffer = io.BytesIO()
        page_width, page_height = landscape(A3)

        max_char_per_column = []
        for col in df.columns:
            max_len = max(df[col].astype(str).map(len).max(), len(col))
            max_char_per_column.append(max_len)

        char_width_pt = 4  # Tamaño letra pequeña

        max_width_nombre_deudor = 200
        col_widths = []
        for col, max_len in zip(df.columns, max_char_per_column):
            ancho = max_len * char_width_pt + 12
            if col == "Nombre deudor":
                ancho = min(ancho, max_width_nombre_deudor)
            col_widths.append(ancho)

        total_width = sum(col_widths)
        margin_total = 20
        available_width = page_width - margin_total

        if total_width > available_width:
            scale = available_width / total_width
            col_widths = [w * scale for w in col_widths]

        style_wrap = ParagraphStyle(
            name='wrap',
            fontName='Helvetica',
            fontSize=4,
            leading=5,
            alignment=TA_CENTER,  # centrado horizontal para el texto
        )

        data_table = [df.columns.tolist()]
        for _, row in df.iterrows():
            new_row = []
            for col in df.columns:
                text = str(row[col])
                if col == "Nombre deudor":
                    new_row.append(Paragraph(text, style_wrap))
                else:
                    new_row.append(text)
            data_table.append(new_row)

        table = Table(data_table, colWidths=col_widths, repeatRows=1)

        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F81BD")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 4),

            ("ALIGN", (0, 0), (-1, -1), "CENTER"),   # Centrado horizontal para todo
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),  # Centrado vertical para todo

            ("LEFTPADDING", (0, 0), (-1, 0), 15),
            ("RIGHTPADDING", (0, 0), (-1, 0), 15),
            ("TOPPADDING", (0, 0), (-1, 0), 6),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 6),

            ("LEFTPADDING", (0, 1), (-1, -1), 6),
            ("RIGHTPADDING", (0, 1), (-1, -1), 6),

            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
            ("FONTSIZE", (0, 1), (-1, -1), 4),

            ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
        ]))

        doc = SimpleDocTemplate(buffer, pagesize=landscape(A3), leftMargin=20, rightMargin=20, topMargin=20, bottomMargin=20)
        doc.build([table])
        buffer.seek(0)

        return buffer, f"data_{uuid.uuid4().hex}.pdf"
    
    @staticmethod
    def export_to_csv(data: List[Dict]):
        # Convertimos la lista de diccionarios a DataFrame
        df = pd.DataFrame(data)

        # Diccionario de mapeo para cambiar el nombre de las columnas
        column_mapping = {
            "lineaNegocio": "Linea de negocio",
            "tipoDeudor": "Tipo de deudor",
            "idDeudor": "Id Deudor",
            "dvDeudor": "Dv Deudor",
            "nombreDeudor": "Nombre deudor",
            "codigoMunicipio": "Codigo Municipio",
            "conceptoDeudores": "Concepto Deudores",
            "tipoDeuda": "Tipo Deuda",
            "medicionPosterior": "Medicion Posterior",
            "cxcPendientesRadicar": "Cxc pntes Radicar",
            "cxcNoVencidas": "Cxc no Vencidas",
            "cxcMora30Dias": "Cxc Mora 30 dias",
            "cxcMora60Dias": "Cxc Mora 60 dias",
            "cxcMora90Dias": "Cxc Mora 90 dias",
            "cxcMora180Dias": "Cxc Mora 180 dias",
            "cxcMora360Dias": "Cxc Mora 360 dias",
            "cxcMoraMayor360Dias": "Cxc Mora >360 dias",
            "deterioro30Dias": "Deterioro 30 dias",
            "deterioro60Dias": "Deterioro 60 dias",
            "deterioro90Dias": "Deterioro 90 dias",
            "deterioro180Dias": "Deterioro 180 dias",
            "deterioro360Dias": "Deterioro 360 dias",
            "deterioroMayor360Dias": "Deterioro >360 dias",
            "ajuste": "Ajuste",
            "saldo": "Saldo"
        }

        # Renombrar columnas
        df = df.rename(columns=column_mapping)

        # Crear archivo en memoria
        buffer = io.StringIO()
        df.to_csv(buffer, index=False, encoding='utf-8-sig')  # UTF-8 con BOM para Excel
        buffer.seek(0)

        # Convertir a BytesIO para subir como archivo
        byte_buffer = io.BytesIO(buffer.getvalue().encode('utf-8-sig'))
        filename = f"data_{uuid.uuid4().hex}.csv"
        return byte_buffer, filename
    
    
    
    @staticmethod
    def get_prefix(texto):
        """Obtiene el prefijo del texto (la primera palabra)"""
        # Validar si el texto es None o está vacío
        if not texto or texto.strip() == "":
            return ""
        return texto.split()[0]
    
    @staticmethod
    def get_number(texto):
        """Obtiene el número después del prefijo"""
        # Validar si el texto es None o está vacío
        if not texto or texto.strip() == "":
            return ""
        # Dividir el texto y verificar si hay al menos dos elementos
        parts = texto.split()
        return parts[1] if len(parts) > 1 else ""
    
    
    def safe_int(value, default=0):
        """Convierte el valor a entero, manejando cadenas vacías y None"""
        try:
            # Validar si el valor está vacío o es None
            if value is None or str(value).strip() == "":
                return default
            # Intentar convertir a entero
            return int(value)
        except ValueError:
            # Retornar el valor predeterminado en caso de error
            return default


    @staticmethod
    def process_data_ft(data: DataFT):

        # Inicializar la lista para almacenar los nuevos objetos procesados
        processed_data = []
        print(data)
        
        for index, item in enumerate(data.dataClean):
            print(f"Fila {index + 1}:")
            
                # Verificar si thirdParty es nulo o vacío, y saltar la iteración si es así
            tipo_deudor = item.get("thirdParty", None)
            if not tipo_deudor:
                continue
            
                    # Crear un nuevo objeto para cada fila con las columnas en español
            nuevo_objeto = {
                "lineaNegocio": None,
                "tipoDeudor": None,
                "idDeudor": None,
                "dvDeudor": None,
                "nombreDeudor": None,
                "codigoMunicipio": None,
                "conceptoDeudores": None,
                "tipoDeuda": None,
                "medicionPosterior": None,
                "cxcPendientesRadicar": None,
                "cxcNoVencidas": None,
                "cxcMora30Dias": None,
                "cxcMora60Dias": None,
                "cxcMora90Dias": None,
                "cxcMora180Dias": None,
                "cxcMora360Dias": None,
                "cxcMoraMayor360Dias": None,
                "deterioro30Dias": None,
                "deterioro60Dias": None,
                "deterioro90Dias": None,
                "deterioro180Dias": None,
                "deterioro360Dias": None,
                "deterioroMayor360Dias": None,
                "ajuste": None,
                "saldo": None
            }
            
            # Validaciones Adicionales
            tipo_deudor = DataService.get_prefix(item.get("thirdParty", None))
            tipo_deudor = 'NI' if tipo_deudor == 'NIT' else tipo_deudor

            idDeudor = DataService.get_number(item.get("thirdParty", None))
            
            # Creación de las columnas
            
            nuevo_objeto["lineaNegocio"] = int(data.businessLine)
            nuevo_objeto["tipoDeudor"] = tipo_deudor
            nuevo_objeto["idDeudor"] =idDeudor
            nuevo_objeto["dvDeudor"] = calcular_dv(DataService.get_number(item.get("thirdParty", None))) if tipo_deudor == 'NI' else 0
            nuevo_objeto["nombreDeudor"] = item.get("accountName", None)
            nuevo_objeto["codigoMunicipio"] = int(data.municipalCode)
            nuevo_objeto["conceptoDeudores"] = int(data.debtorConcept)
            nuevo_objeto["tipoDeuda"] = 2
            nuevo_objeto["medicionPosterior"] = int(data.subsequentMeasurement)
            
            nuevo_objeto["cxcPendientesRadicar"] = DataService.safe_int(item.get("openingBalance", None))
            nuevo_objeto["cxcNoVencidas"] = 0
            nuevo_objeto["cxcMora30Dias"] = 0
            nuevo_objeto["cxcMora60Dias"] = 0
            nuevo_objeto["cxcMora90Dias"] = 0
            nuevo_objeto["cxcMora180Dias"] = 0
            nuevo_objeto["cxcMora360Dias"] = 0
            nuevo_objeto["cxcMoraMayor360Dias"] = 0
            nuevo_objeto["deterioro30Dias"] = 0
            nuevo_objeto["deterioro60Dias"] = 0
            nuevo_objeto["deterioro90Dias"] = 0
            nuevo_objeto["deterioro180Dias"] = 0
            nuevo_objeto["deterioro360Dias"] = 0
            nuevo_objeto["deterioroMayor360Dias"] = 0
            

            
            nuevo_objeto["ajuste"] = 0
            
            
            # Sumar todos los valores y asignar el resultado a "saldo"
            resultado = (
                nuevo_objeto["cxcPendientesRadicar"]
                + nuevo_objeto["cxcNoVencidas"]
                + nuevo_objeto["cxcMora30Dias"]
                + nuevo_objeto["cxcMora60Dias"]
                + nuevo_objeto["cxcMora90Dias"]
                + nuevo_objeto["cxcMora180Dias"]
                + nuevo_objeto["cxcMora360Dias"]
                + nuevo_objeto["cxcMoraMayor360Dias"]
                + nuevo_objeto["deterioro30Dias"]
                + nuevo_objeto["deterioro60Dias"]
                + nuevo_objeto["deterioro90Dias"]
                + nuevo_objeto["deterioro180Dias"]
                + nuevo_objeto["deterioro360Dias"]
                + nuevo_objeto["deterioroMayor360Dias"]
            )
            nuevo_objeto["saldo"] = resultado
            
              # Agregar el objeto procesado a la lista
            processed_data.append(nuevo_objeto)
            
            


        return processed_data