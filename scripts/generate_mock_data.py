
import sys
import os
import time
from pathlib import Path

# Add core/ to path so we can import framework
sys.path.append(os.path.abspath("core"))

from framework.runtime.core import Runtime
from framework.schemas.decision import DecisionType

def generate_mock_data():
    # Use the REAL global storage path
    storage_path = Path.home() / ".hive" / "storage"
    if not storage_path.exists():
        storage_path.mkdir(parents=True)

    print(f"Initializing Runtime with storage at {storage_path}...")
    runtime = Runtime(storage_path)

    # 1. Start a Run
    print("Starting Mock Run...")
    run_id = runtime.start_run(
        goal_id="goal_submission_test",
        goal_description="Submission Readiness Test - Final Verification",
        input_data={"status": "checking_integrations", "target": "production"}
    )
    print(f"Run Started: {run_id}")

    # 2. Simulate Decision: Plan the task
    print("Step 1: Planning...")
    runtime.decide_and_execute(
        intent="Create a research plan",
        options=[
            {"id": "deep_dive", "description": "Detailed academic research", "confidence": 0.3},
            {"id": "quick_summary", "description": "Search news aggregators", "confidence": 0.9}
        ],
        chosen="quick_summary",
        reasoning="User asked for latest news, speed is more important than depth.",
        executor=lambda: {"plan": ["search_google", "extract_content", "summarize"]},
        decision_type=DecisionType.PATH_CHOICE
    )

    # 3. Simulate Decision: Execute Search
    print("Step 2: Searching Web...")
    runtime.decide_and_execute(
        intent="Search for 'latest AI agent news'",
        options=[{"id": "google", "description": "Google Search"}],
        chosen="google",
        reasoning="Standard search engine.",
        executor=lambda: time.sleep(0.5) or ["Article A", "Article B", "Article C"], # Simulate latency
        node_id="search_tool"
    )

    # 4. Simulate Failure (to show error states)
    print("Step 3: Extracting Content (simulating transient error)...")
    try:
        runtime.decide_and_execute(
            intent="Scrape content from Article A",
            options=[{"id": "scrape", "description": "Jina Reader"}],
            chosen="scrape",
            reasoning="Best tool for text content.",
            executor=lambda: (_ for _ in ()).throw(Exception("Connection timeout")),
        )
    except Exception as e:
        print(f"Caught expected error: {e}")

    # 5. Simulate Retry/Success
    print("Step 3 (Retry): Extracting Content...")
    runtime.decide_and_execute(
        intent="Scrape content from Article A (Retry)",
        options=[{"id": "scrape_retry", "description": "Jina Reader (Retry)"}],
        chosen="scrape_retry",
        reasoning="Previous error was transient.",
        executor=lambda: {"content": "Aden is a new agent framework..."},
    )

    # 6. End Run
    print("Finishing Run...")
    runtime.end_run(
        success=True,
        narrative="Successfully researched AI Agents and found 3 key articles.",
        output_data={"summary": "AI Agents are cool."}
    )

    print("\nDone! Data generated in:")
    print(f"- Run Log: {storage_path}/runs/{run_id}.json")

    return run_id

if __name__ == "__main__":
    generate_mock_data()
