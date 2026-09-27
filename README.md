# Daylo Lab

A throwaway copy of [Daylo](https://github.com/henfrydls/daylo) that exists to run one
thing end to end before the real one does it in front of people: **the updater**.

It publishes releases the same way Daylo does, with the same workflow and the same
scripts, so that installing one version here and being offered the next is the same
sequence of events that Daylo 1.4.0 will put in front of somebody in a few days.

## Where it came from

Built from `henfrydls/daylo` at commit `71e7f470801a694418b693646b684fc3f94f08a7`, which is
v1.4.0 on `main`. Nothing here is written by hand except the differences below.

## What is different, and why each one

| Change | Why |
|---|---|
| `identifier` is `com.daylo.lab` | so a lab copy keeps its own data and cannot touch the data of a real Daylo on the same machine |
| the window title says **Daylo Lab** | so you can tell which one you are looking at. The product name stays `Daylo`, because every artifact name in the release workflow and every pattern in the manifest composer is built from it, and the point of this repository is to run that path unchanged |
| the updater endpoint is this repository's `latest.json` | it is the address under test |
| the signing key is a **test key**, `F5D1D1CD8B8DFCA9` | the key that signs real Daylo updates is not in this repository and never will be. This one signs nothing anybody has installed |
| the anonymous check-in is **off at compile time** | a lab copy has an empty profile, an empty profile is a new installation, and a new installation turns the check-in on. That would write rows into the panel that counts real installations. It is not an environment variable here, because a variable is something to forget on five runners and again on the machine that installs the result |
| the Android job is off | Android has no updater. A phone updates from a store or from a new APK, so it is outside the path this repository runs |
| four workflows are gone (Flatpak, MSIX, the MSIX probe, the test build) | none of them is part of the update path, and each one costs runner minutes on a private repository |

`release.yml`, `ci.yml` and the signing-secret check are **unchanged**, and so is every
script they call. That is the whole idea: if the manifest composer refuses something here,
it will refuse the same thing there.

## What a release here proves

1. Five platforms build and upload their artifacts and their signatures.
2. `scripts/updater-manifest.js` composes one `latest.json` from them, refusing if a
   platform is missing, if two artifacts claim one platform, or if the release note is
   empty, too long, or word for word the previous one.
3. The address the app actually reads, `/releases/latest/download/latest.json`, gives back
   the version just published.
4. A copy of the earlier version, running, is offered the later one, takes it, verifies the
   signature, installs it and comes back on the new version.

Step 4 is the one nothing else could prove.
