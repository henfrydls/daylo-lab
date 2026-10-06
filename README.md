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

| Change                                                                  | Why                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `identifier` is `com.daylo.lab`                                         | so a lab copy keeps its own data and cannot touch the data of a real Daylo on the same machine                                                                                                                                                                                                                                                  |
| the window title says **Daylo Lab**                                     | so you can tell which one you are looking at. The product name stays `Daylo`, because every artifact name in the release workflow and every pattern in the manifest composer is built from it, and the point of this repository is to run that path unchanged                                                                                   |
| the updater endpoint is this repository's `latest.json`                 | it is the address under test                                                                                                                                                                                                                                                                                                                    |
| the signing key is a **test key**, `F5D1D1CD8B8DFCA9`                   | the key that signs real Daylo updates is not in this repository and never will be. This one signs nothing anybody has installed                                                                                                                                                                                                                 |
| the anonymous check-in is **off at compile time**                       | a lab copy has an empty profile, an empty profile is a new installation, and a new installation turns the check-in on. That would write rows into the panel that counts real installations. It is not an environment variable here, because a variable is something to forget on five runners and again on the machine that installs the result |
| the Android build signs with a key made for that build                  | the real signing key is not in this repository and must not be. Nothing on Android updates over anything, because there is no updater there, so there is nothing for a stable key to protect. The cost: two lab APKs cannot be installed over each other                                                                                        |
| four workflows are gone (Flatpak, MSIX, the MSIX probe, the test build) | none of them is part of the update path, and each one costs runner minutes on a private repository                                                                                                                                                                                                                                              |

`ci.yml` differs only in the identifier its smoke check looks for. `release.yml` differs in
one place, marked in the file: the keystore it signs Android with. Everything else in both,
and every script they call, is what `main` has. That is the whole idea: if the manifest
composer refuses something here, it will refuse the same thing there.

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

Two rounds now, and they are different machines.

**On a computer**, the one from last time: install the lab's 1.4.2, let it find the lab's
1.4.3, and watch the update happen. That path has been walked before and what is being
checked is that it still works with everything 1.4.1 changed.

**On a phone**, the one that matters this time. The two main changes in 1.4.1 are things
only a phone can show: the back button, and sliding between the views. There is no updater
on Android at all, so nothing is being updated there; the APK is installed once and tried.

**Write down anything that does not match what is described here, in the words you would
use to tell somebody what you saw.** A step that goes differently is worth more than a step
that goes as written.

## On the phone

Install `Daylo-android-arm64.apk` from the **v1.4.2** release of this repository.

It installs **beside** your real Daylo and touches nothing of it: different identifier,
different data. It is called Daylo on the home screen and says **Daylo Lab** in its window,
which is the only way to tell them apart at a glance.

One thing to know before you start: **two lab APKs cannot be installed over each other.**
They are signed with a key made for that build, because the real signing key is not in this
repository. If you ever install a second one, uninstall the first.

### The back button

This is the change. It used to close Daylo from anywhere; now it takes away whatever is in
front of you.

1. Tap a day to open the day sheet. **Press back.** The sheet goes and Daylo stays.
2. Open the menu, then **Check for new versions**. **Press back.** The sheet goes.
3. Open a dialog from inside another one if you can find a pair. **Press back.** Only the
   top one goes, and the one underneath is still there.
4. From the main screen, with nothing open, **press back.** Daylo closes, as it always did.

Step 4 is the one worth being sure about: it would be a bad trade to gain the first three
and lose the way out.

### Sliding between Year and Month

The two views now move together under your finger instead of one being swapped for the
other.

1. In **Year**, drag **left**. Month follows your finger as you drag, and arrives when you
   let go past about a third of the screen.
2. Drag **right** from Month: Year comes back the same way.
3. Drag **halfway and let go**: it goes back where it was.
4. In **Year**, drag **right**: it gives a little and stops. There is nothing that way.
   This used to go to Month, so if you learned the old way it will feel wrong at first,
   and that is the change rather than a fault.
5. Tap a month card in Year, and tap the month title in Month: both travel the same way the
   finger does.

**The one to try carefully, because it is the risk this round exists for:** in **Month**,
start a drag to the right **within a thumb's width of the left edge of the screen**, where
Android's own back gesture lives. Whatever happens, write down which one won: the app, the
system, or neither.

If your phone is set to reduce motion, nothing slides. The view changes at once, which is
correct.

## On a computer: the update

Everything is under the **v1.4.2** release of this repository, not "latest": latest will be
1.4.3, which is the thing being updated to.

| System                  | File                            |
| ----------------------- | ------------------------------- |
| Windows (Intel or AMD)  | `Daylo-windows-x64-setup.exe`   |
| Windows on ARM          | `Daylo-windows-arm64-setup.exe` |
| Mac with Apple chip     | `Daylo-macos-apple-silicon.dmg` |
| Mac with Intel          | `Daylo-macos-intel.dmg`         |
| Linux, Debian or Ubuntu | `Daylo-linux-amd64.deb`         |
| Linux, anything else    | `Daylo_1.4.2_amd64.AppImage`    |

Each one lives at
`https://github.com/henfrydls/daylo-lab/releases/download/v1.4.2/<the file name>`.

**1. It opens.** The window is titled **Daylo Lab**. It keeps its own data: nothing you do
here touches your habits. There is no line about the anonymous check-in and no check-in
entry in the menu, which is on purpose in this build.

**2. A second or two later, a line appears under the header.**

> (an icon) **Daylo 1.4.3 is out.** Update ✕

**3. Press the ✕.** The line goes and a small green dot appears on the three dots at the top
right. The menu entry **Check for new versions** has the same dot.

**4. Open Check for new versions.** One line saying **Daylo 1.4.3 is out.**, one saying
**Daylo asks GitHub and sends nothing about you.**, and two buttons: **Stop checking
automatically** and **Update**.

**5. Press Update.** Downloading with a number that climbs and stops at 99, then
**Installing. Daylo will close and open again.**, then the app comes back by itself.

**6. It came back.** The menu's bottom row says **v1.4.3**, and the line is gone.

If you installed the `.deb`, step 2 says the same sentence but the link says **Get it from
the downloads page** and installs nothing, which is correct: installing a `.deb` needs your
administrator password and Daylo does not ask anybody for that.

## If you want to do a round again

Uninstall and install again. The line is shown once per version, so a copy that has already
been offered 1.4.3 will not offer it twice: it leaves the dot on the menu instead.

# Publishing a lab release

Two tags, in this order. Each one is a full release: five platforms, their signatures, and
one `latest.json` composed from them.

    git tag v1.4.0 && git push origin v1.4.0

Then, once that run is finished:

    npm version patch --no-git-tag-version
    # changelog.d/RELEASE-NOTE.md has to say something different from the previous release:
    # the manifest job refuses a note that is word for word the one before it.
    git commit -am "Daylo Lab 1.4.1: the version there is to update to"
    git tag v1.4.1 && git push origin main v1.4.1

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
