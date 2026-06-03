# Stage 1

## Approach to Sorting the Priority Inbox
To determine the top notifications, we fetch the data from the API and apply a strict sorting mechanism:
1. **Priority Weighting:** Each notification type is assigned a numerical weight (`Placement = 3`, `Result = 2`, `Event = 1`). 
2. **Sorting Logic:** The array is first sorted in descending order based on this weight. 
3. **Recency Tie-Breaker:** If two notifications share the same weight (e.g., both are `Placement`), they are compared using their `Timestamp` value, sorting the most recent ones first.
Finally, we slice the first 10 elements of the sorted array to get the top priority inbox items.

## Maintaining the Top 10 Efficiently
As new notifications continuously arrive in a real-world scenario, sorting the entire dataset every time is highly inefficient (`O(N log N)` time complexity). 

To maintain the top 10 efficiently as data streams in, we should use a **Min-Heap (Priority Queue)** data structure constrained to a maximum size of 10 (`K = 10`):
- When a new notification arrives, we compare its priority/timestamp against the *least* important notification currently in our top 10 (the root of the min-heap).
- If the new notification is more important, we extract the minimum from the heap and insert the new one.
- Since the size of the heap is strictly capped at 10, the insertion operation takes `O(log K)` time. Because `K` is a constant (10), the time complexity to process any new incoming notification becomes **`O(1)`**. 
This ensures our Priority Inbox updates instantly with virtually zero performance overhead, no matter how many millions of notifications come in.
