from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("MyFastAPIApp") \
    .master("local[*]") \
    .getOrCreate()
