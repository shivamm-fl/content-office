# DSA coding series publisher companion

`ai-course-dsa-coding.patch` adds `b → blind75` and `p → potd` to the DSA publishing account, plus regression checks for correct handover and refusal to post these ids as LearnAI. The publisher already derives credentials, Facebook routing and manual handover ownership from this table. No new social credentials or publishing schedule are introduced.

Prepared against ai-course `d462f31` in a clean checkout because the existing ai-course checkout contains unrelated local edits. Its files were preserved. The clean implementation is at `C:/Users/acer/.codex/visualizations/2026/11/01/01a1970e-831a-7e51-9cde-5ac8f4f3bf70/dsa-publisher`, branch `codex/dsa-coding-publisher`. This repository includes the companion patch; the separate ai-course changes still require their own application/release. Pushing this patch does not deploy or enable publishing.

Apply the patch to an up-to-date ai-course checkout before enabling the coding automation:

```powershell
git apply --check C:/Users/acer/Desktop/startup/_acp_sources/content-office/integrations/ai-course-dsa-coding.patch
git apply C:/Users/acer/Desktop/startup/_acp_sources/content-office/integrations/ai-course-dsa-coding.patch
python scripts/test_publish_teams.py
python scripts/test_office_handover.py
```

Both publisher suites passed in the clean checkout with mocked requests; nothing was posted. DSA's current platform switches remain in effect (Instagram and Facebook where the existing length rules permit; no DSA YouTube account is configured).
