from pathlib import Path
import runpy
ns = runpy.run_path(str(Path(__file__).resolve().parents[5] / "tools/blind75_batch_12_21.py"))
solution = runpy.run_path(str(Path(__file__).with_name("solution.py")))
print(ns["tests"]("b017", solution["Solution"]))
