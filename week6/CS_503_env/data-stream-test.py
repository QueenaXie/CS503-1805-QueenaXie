import json

from pyspark import SparkConf
from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from time import sleep

data_stream_module = __import__("data-stream")
topic = 'test_topic'

# 42000 / 3 = 14000
test_input = [
 	json.dumps({'Timestamp': '1526900000001', 'Symbol': 'BTC-USD',
	'LastTradePrice':'10000'}),
 	json.dumps({'Timestamp': '1526900000001', 'Symbol': 'BTC-USD',
	'LastTradePrice':'12000'}),
	 json.dumps({'Timestamp': '1526900000001', 'Symbol': 'BTC-USD',
	'LastTradePrice':'20000'}),
	]

class TestKafkaProducer():
 	def __init__(self):
 		self.target_topic = None
 		self.value = None
 
 	def send(self, target_topic, value):
 		self.target_topic = target_topic
 		self.value = value
 	
 	def log(self):
 		print 'target_topic: %s, value: %s' % (self.target_topic, self.value)
	
	def _isclose(a, b, rel_tol=1e-09, abs_tol=0.0):
 		return abs(a-b) <= max(rel_tol * max(abs(a), abs(b)), abs_tol)
	
	def _make_dstream_helper(sc, ssc, input):
 		input_rdds = [sc.parallelize(test_input, 1)]
 		input_stream = ssc.queueStream(input_rdds)
 		return input_stream

 	def test_data_stream(sc, ssc, topic):
 		input_stream = _make_dstream_helper(sc, ssc, test_input)
 		kafkaProducer = TestKafkaProducer()
 		data_stream_module.process_stream(input_stream, kafkaProducer, topic)
 		ssc.start()
 		sleep(5)
 		ssc.stop()
 		assert _isclose(json.loads(kafkaProducer.value)['Average'], 14000.0)
 		print 'test_data_stream passed!'

if __name__ == '__main__':
 	conf = (SparkConf().setMaster('local[2]').setAppName('local-testing'))
 	spark_context = SparkContext(conf=conf)
 	streaming_context = StreamingContext(spark_context, 1)
 	test_data_stream(spark_context, streaming_context, topic)