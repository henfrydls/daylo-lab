# Daylo Lab

A throwaway copy of [Daylo](https://github.com/henfrydls/daylo) that exists to run one
thing end to end before the real one does it in front of people: **the updater**.

It publishes releases the same way Daylo does, with the same workflow and the same
scripts, so that installing one version here and being offered the next is the same
sequence of events a real Daylo puts in front of somebody. It has grown a second job since:
anything that only a phone can judge gets built here first, because the public repository
cannot publish a version nobody has held.

## Where it came from

Built from `henfrydls/daylo` at commit `5b6542d`. Nothing here is written by hand except
the differences below, and this tree is not edited in place: every round it is thrown away
and built again from that commit, with those differences applied on top.

That commit is now written by the refresh and not typed, which is the only reason to trust
it. It said v1.4.0 for two refreshes after it had stopped being true, and the same round of
hand editing quietly dropped a comment out of `release.yml`, so this file was claiming a
difference of one place where there were two.

## What is different, and why each one

| Change                                                                  | Why                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` is `com.daylo.lab`                                         | so a lab copy keeps its own data and cannot touch the data of a real Daylo on the same machine                                                                                                                                                                                                                                                  |
| the window title says **Daylo Lab**                                     | so you can tell which one you are looking at. The product name stays `Daylo`, because every artifact name in the release workflow and every pattern in the manifest composer is built from it, and the point of this repository is to run that path unchanged                                                                                   |
| the updater endpoint is this repository's `latest.json`                 | it is the address under test                                                                                                                                                                                                                                                                                                                    |
| the signing key is a **test key**, `F5D1D1CD8B8DFCA9`                   | the key that signs real Daylo updates is not in this repository and never will be. This one signs nothing anybody has installed                                                                                                                                                                                                                 |
| the anonymous check-in is **off at compile time**                       | a lab copy has an empty profile, an empty profile is a new installation, and a new installation turns the check-in on. That would write rows into the panel that counts real installations. It is not an environment variable here, because a variable is something to forget on five runners and again on the machine that installs the result |
| the Android build signs with a key made for that build                  | the real signing key is not in this repository and must not be. Nothing on Android updates over anything, because there is no updater there, so there is nothing for a stable key to protect. The cost: two lab APKs cannot be installed over each other                                                                                        |
| four workflows are gone (Flatpak, MSIX, the MSIX probe, the test build) | none of them is part of the update path, and each one costs runner minutes on a private repository                                                                                                                                                                                                                                              |

`ci.yml` and `.github/scripts/android-smoke.sh` differ only in the identifier their smoke
checks look for. `release.yml` differs in one place, marked in the file: the keystore it
signs Android with. Everything else in both, and every other script they call, is what
`main` has. That is the whole idea: if the manifest composer refuses something here, it
will refuse the same thing there.

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

---

# The round

One thing changed, and it is the one you said: letting go.

Install `Daylo-android-arm64.apk` from the **v1.4.8** release of this repository.
**Uninstall whichever Daylo Lab is on the phone first**: lab builds are signed with a key
made for that build, so one cannot be installed over another. It installs beside your real
Daylo and touches nothing of it.

**Write down anything that does not match, in the words you would use to tell somebody what
you saw.**

## The one thing

**Let go while your hand is still moving.** Slide between Year and Month at a fair pace and
take your finger off without slowing down first. The view should carry on at the speed your
hand had and then be put down, with nothing in between.

What you said last time was that letting go fast made it go slower at once, and you were
exactly right: it was filmed and read frame by frame, and the first frame after your finger
left moved four pixels where your finger had been moving sixty. The view stopped dead for a
frame and set off again. The curve it was following started from a standstill by
construction, whatever your hand had been doing.

Now the curve is drawn for the gesture you just made.

**Then let go of a slow one.** Drag across without hurrying, and stop your hand before
lifting it. That one should be unchanged from the last build: gentle, put down rather than
thrown. If it feels different, that is worth knowing, because it is not supposed to be.

The two together are the whole question: a fast release should feel continuous, and a slow
one should feel exactly as it did.

## Nothing else moved

The ends of the line, going back from a drag that did not go far enough, the toggle, and
how long a landing takes are all untouched. The back button closes Daylo from both views.

# Publishing a lab release

One tag per round, and each one is a full release: five platforms, their signatures, and
one `latest.json` composed from them. The round before it is the version that gets offered
this one, which is the thing being tested, so there is always a previous release to update
from.

The tree is not edited here. It is rebuilt from Daylo's `main` with the lab differences
applied on top, by the scripts kept outside this repository, and then:

    git add -A && git commit -m "Daylo Lab <version>: ..."
    git push origin main
    # once the push has gone green:
    git tag v<version> && git push origin v<version>

## What to look at in each run

1. **Five Build jobs**, one per platform, and Android, which builds here now so there is an
   APK to try.
2. **Updater manifest → Compose it.** It refuses if a platform is missing, if two artifacts
   claim one platform, or if the release note is empty, too long, or word for word the
   previous one. Five platforms in, Android not among them, because a phone has no updater
   to read a manifest: it has
   `windows-x86_64`, `windows-aarch64`, `darwin-x86_64`, `darwin-aarch64`, `linux-x86_64`.
3. **The address the app reads gives back this version.** This is the step that only a
   published release can answer, and the one this whole repository exists for. It asks
   `https://github.com/henfrydls/daylo-lab/releases/latest/download/latest.json` and
   compares what it says with the tag.
4. The `latest.json` attached to the release: five platforms, each with a `url` under this
   repository and a `signature`.

# The rehearsal that only a lab can do: a signature that does not match

Daylo refuses an update signed by anything other than the key inside it, and says so:
**"That update could not be verified, so nothing was installed."** Nobody should ever see
that sentence in the real app, which is exactly why it is worth seeing once here.

It is prepared and not run. The recipe, for when the ordinary path has been seen working:

1. Generate a second test key, apart from the one this repository publishes with.
2. Replace `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` in this
   repository's secrets with the second key. **The `pubkey` in `tauri.conf.json` does not
   change**: that is the whole point, the app keeps looking for the first key.
3. Tag `v1.4.2`. It builds and publishes exactly like the others.
4. A lab copy on 1.4.1 is offered 1.4.2, takes it, and stops with that sentence, having
   installed nothing. The app is still on 1.4.1 afterwards, which is the part worth
   checking.
5. Afterwards, delete the 1.4.2 release and put the first key back in the secrets, or every
   lab copy keeps being offered an update it will keep refusing.
