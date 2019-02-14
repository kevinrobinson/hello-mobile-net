# assumes conda, see https://www.tensorflow.org/install/pip

# create env
conda create -n hello-mobile-net pip python=3.6
conda activate hello-mobile-net

# upgrade pip to be able to find latest tensorflow
pip install --upgrade pip
pip install tensorflowjs

# model: https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/feature_vector/2
# converter: https://github.com/tensorflow/tfjs-converter
tensorflowjs_converter \
  --input_format=tf_hub \
  'https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/feature_vector/2' \
  public/mobilenet/web_model