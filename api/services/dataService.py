import io
import uuid
from typing import List, Dict, Tuple
import pandas as pd
import xml.etree.ElementTree as ET

from api.models.data import DataFT
from api.utils.dian import calcular_dv

from reportlab.lib.pagesizes import A3, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER


class DataService:
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
        pdf = pd.DataFrame(data)

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

        pdf = pdf.rename(columns=column_mapping)

        memory_file = io.BytesIO()
        with pd.ExcelWriter(memory_file, engine="xlsxwriter") as writer:
            pdf.to_excel(writer, index=False, sheet_name="Sheet1")
            workbook = writer.book
            worksheet = writer.sheets["Sheet1"]

            header_format = workbook.add_format({
                "align": "left",
                "bold": True,
                "font_color": "#FFFFFF",
                "bg_color": "#4F81BD",
                "font_name": "Calibri",
                "font_size": 10
            })

            cell_format = workbook.add_format({
                "align": "left",
                "font_name": "Calibri",
                "font_size": 10
            })

            for col_num, col_name in enumerate(pdf.columns):
                worksheet.write(0, col_num, col_name, header_format)

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

        df = df.rename(columns=column_mapping).fillna("")

        buffer = io.BytesIO()
        page_width, page_height = landscape(A3)

        max_char_per_column = [
            max(df[col].astype(str).map(len).max(), len(col))
            for col in df.columns
        ]

        char_width_pt = 4
        max_width_nombre_deudor = 200
        col_widths = [
            min(max_len * char_width_pt + 12, max_width_nombre_deudor if col == "Nombre deudor" else float('inf'))
            for col, max_len in zip(df.columns, max_char_per_column)
        ]

        total_width = sum(col_widths)
        available_width = page_width - 20
        if total_width > available_width:
            scale = available_width / total_width
            col_widths = [w * scale for w in col_widths]

        style_wrap = ParagraphStyle(
            name='wrap',
            fontName='Helvetica',
            fontSize=4,
            leading=5,
            alignment=TA_CENTER,
        )

        data_table = [df.columns.tolist()]
        for _, row in df.iterrows():
            new_row = [
                Paragraph(str(row[col]), style_wrap) if col == "Nombre deudor" else str(row[col])
                for col in df.columns
            ]
            data_table.append(new_row)

        table = Table(data_table, colWidths=col_widths, repeatRows=1)
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F81BD")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 4),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
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
        df = pd.DataFrame(data)
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

        df = df.rename(columns=column_mapping)
        buffer = io.StringIO()
        df.to_csv(buffer, index=False, encoding='utf-8-sig')
        buffer.seek(0)
        byte_buffer = io.BytesIO(buffer.getvalue().encode('utf-8-sig'))
        filename = f"data_{uuid.uuid4().hex}.csv"
        return byte_buffer, filename

    @staticmethod
    def get_prefix(texto):
        return texto.split()[0] if texto and texto.strip() else ""

    @staticmethod
    def get_number(texto):
        parts = texto.split() if texto and texto.strip() else []
        return parts[1] if len(parts) > 1 else ""

    def safe_int(value, default=0):
        try:
            if value is None or str(value).strip() == "":
                return default
            return int(value)
        except ValueError:
            return default

    @staticmethod
    def process_data_ft(data: DataFT):
        processed_data = []

        for item in data.dataClean:
            tipo_deudor = item.get("thirdParty")
            if not tipo_deudor:
                continue

            tipo_deudor = DataService.get_prefix(tipo_deudor)
            tipo_deudor = 'NI' if tipo_deudor == 'NIT' else tipo_deudor
            idDeudor = DataService.get_number(item.get("thirdParty"))

            nuevo_objeto = {
                "lineaNegocio": int(data.businessLine),
                "tipoDeudor": tipo_deudor,
                "idDeudor": idDeudor,
                "dvDeudor": calcular_dv(idDeudor) if tipo_deudor == 'NI' else 0,
                "nombreDeudor": item.get("accountName"),
                "codigoMunicipio": int(data.municipalCode),
                "conceptoDeudores": int(data.debtorConcept),
                "tipoDeuda": 2,
                "medicionPosterior": int(data.subsequentMeasurement),
                "cxcPendientesRadicar": DataService.safe_int(item.get("openingBalance")),
                "cxcNoVencidas": 0,
                "cxcMora30Dias": 0,
                "cxcMora60Dias": 0,
                "cxcMora90Dias": 0,
                "cxcMora180Dias": 0,
                "cxcMora360Dias": 0,
                "cxcMoraMayor360Dias": 0,
                "deterioro30Dias": 0,
                "deterioro60Dias": 0,
                "deterioro90Dias": 0,
                "deterioro180Dias": 0,
                "deterioro360Dias": 0,
                "deterioroMayor360Dias": 0,
                "ajuste": 0,
            }

            nuevo_objeto["saldo"] = sum([
                nuevo_objeto["cxcPendientesRadicar"],
                nuevo_objeto["cxcNoVencidas"],
                nuevo_objeto["cxcMora30Dias"],
                nuevo_objeto["cxcMora60Dias"],
                nuevo_objeto["cxcMora90Dias"],
                nuevo_objeto["cxcMora180Dias"],
                nuevo_objeto["cxcMora360Dias"],
                nuevo_objeto["cxcMoraMayor360Dias"],
                nuevo_objeto["deterioro30Dias"],
                nuevo_objeto["deterioro60Dias"],
                nuevo_objeto["deterioro90Dias"],
                nuevo_objeto["deterioro180Dias"],
                nuevo_objeto["deterioro360Dias"],
                nuevo_objeto["deterioroMayor360Dias"]
            ])

            processed_data.append(nuevo_objeto)

        return processed_data
