---
title: Ask ChatGPT 4
date: 2023-10-12 20:00:00 +0200
categories: story
tags: python programming ai machine-learning automation
---

# How to build a script with ChatGPT 4

For a few days now, after talking to my friend Frédéric about ChatGPT 4 and its web browsing capabilities, I have been thinking about how to put it to use in my work. Yesterday, I finally remembered my colleague Steve's request to his team member Rosy to build a script which could push Checkpoint firewall policies.

The goal of the script is to push all firewall policies to sometimes multiple targets per policy without overloading the management server.

I started by stating a simple query.

```
Python script to push all policies using checkpoint smart console api with a list of exceptions. Logging should be done and keep 4 log files as history. 
```

With that, I got a simple and effective result of a single file with all the script inside. The Checkpoint query was made using cpapi. Everything was done in a single script file `main.py`. The policies to be pushed had to be specified in the script.

So I continued by telling the script to add a configuration file for the SMS connection details. Chat extended the use of the configuration file to the SMTP settings and to read secrets from a `.env` file. I had to provide the link to the `cp-mgmt-api-sdk` library so it would use it.

I needed to tell Chat that I didn't want to list my policies, but that he should read the list from the API.

Then I asked Chat to create an HTML report. First it just created a dumb record of some data. So I gave it more precision and told it to report on the status of the query.

Another thing which was not quite good enough was the policy push itself.
1. It did all the policy push one after another.
1. No target was specified for the policy installation.

So I had to request that a maximum of 5 policies would be pushed concurrently and informed Chat that in some cases, the policies could be pushed on multiple targets.

Being thorough, I asked Chat to write the documentation and to build a Makefile to manage the virtual environment, which it did, and quite well on top of that. 

On and on it went for over an hour. All in all, it's really quite good. Except that with the iterations, it started forgetting things I requested earlier. So I reminded it of the omissions which it corrected rightaway. It's almost human in behaviour.

It's very impressive to build up a small project like that from scratch. In the end, it's much quicker to do it like this than write everything yourself. And the code and the library choice looks also very good. The code is probably a fifth of the length of what I would have done for the same task.

I didn't test it yet. It might not even work at all. But the global structure is there.

It's a new way of programming.

-

for this to work, you need ChatGPT 4 and enable the `browsing with Bing` beta setting.

## Reference

- [Chat history](https://chat.openai.com/share/af1c3afc-0cbe-4a23-94d5-fb00837f453c)<br>
The complete history of what I asked and what was returned by ChatGPT4.
- [Code rendered](https://github.com/chemage/cp_policy_push)<br>
All the files in here have been rendered by ChatGPT4.
