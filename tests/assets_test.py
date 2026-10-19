import importlib.util, tempfile, unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('assets',Path(__file__).parents[1]/'scripts/check-assets.py')
assets=importlib.util.module_from_spec(spec);spec.loader.exec_module(assets)
class AssetChecks(unittest.TestCase):
 def test_svg_is_sanitised(self):
  bad=['<script>alert(1)</script>','<foreignObject/>','<animate/>','<rect onload="alert(1)"/>','<image href="https://evil.test/pixel.png"/>','<rect style="fill:red"/>']
  with tempfile.TemporaryDirectory() as folder:
   p=Path(folder)/'test.svg'
   for payload in bad:
    with self.subTest(payload=payload):
     p.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="50">'+payload+'</svg>')
     with self.assertRaises(ValueError):assets.inspect(p)
   p.write_text('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="50"><rect width="320" height="50" fill="#123456"/></svg>')
   self.assertEqual(assets.inspect(p),(320,50))
 def test_svg_dtd_and_oversized_assets_rejected(self):
  with tempfile.TemporaryDirectory() as folder:
   p=Path(folder)/'test.svg';p.write_text('<!DOCTYPE svg><svg xmlns="http://www.w3.org/2000/svg" width="320" height="50"/>')
   with self.assertRaises(ValueError):assets.inspect(p)
   p.write_text('a'*150001)
   with self.assertRaises(ValueError):assets.inspect(p)
if __name__=='__main__':unittest.main()
